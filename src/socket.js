'use strict';

const net = require('net');
const fs = require('fs');

/**
 * Provide handler to remove socket created in tmpDir
 * @param {String} _sockName - socket path
 */
function cleanUp(_sockName) {
  let cleanUpPerformed;
  return () => {
    if (!cleanUpPerformed) {
      fs.unlink(
        _sockName,
        () => process.exit()
      );
      cleanUpPerformed = true;
    }
  };
}

/**
 * Create a dummy UNIX socket file in /tmp folder and start a dummy server
 * to prevent node runtime from exiting the script.
 *  - can be used in scripts that must run 'forever'
 *  - removes created socket when script gets killed
 * @param {Function} callback - callback called when server is lisening on the created socket file
 * @param {String} tmpDir - directory path where UNIX socket file will be created
 */
function mainLoop(callback, tmpDir) {
  tmpDir = tmpDir || '/tmp';
  callback = callback || () => {};
  if (fs.statSync(tmpDir).isDirectory()) {
    let sockPath = `${tmpDir}/${Date.now()}.sock`;

    //set up server
    let server = net.createServer(socket => socket.end('\n'));

    server.on('error', (err) => {
      console.error(err ? err.stack : 'mainLoop server error');
      throw err;
    });

    server.listen({ path: sockPath }, callback);

    //set up clean up
    const cleanUpHandler = cleanUp(sockPath);

    process.on('exit', cleanUpHandler);
    process.on('uncaughtException', (err) => {
      cleanUpHandler();
      throw err;
    });

    process.on('SIGINT', cleanUpHandler);
    process.on('SIGTERM', cleanUpHandler);
  }
}

/** export mainLoop function */
module.exports = mainLoop;