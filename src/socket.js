'use strict';

const net = require('net');
const fs = require('fs');

/** removes /tmp socket */
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
 * !!! NOT INTENDED FOR PRODUCTION !!!
 *  - mainLoop creates a dummy socket in /tmp to prevent node runtime
 *    from exiting the script
 *  - can be used in scripts that must run 'forever'
 *  - removes created socket when script gets killed
 * @summary prevent calling script from being closed.
 */
function mainLoop(callback, tmpDir) {
  tmpDir = tmpDir || '/tmp';
  if (fs.statSync(tmpDir).isDirectory()) {
    let server = net.createServer(
      (socket) => {
        socket.end('\n');
      }).on('error', (err) => {
        // handle errors here
        throw err;
      });

    let sockPath = `${tmpDir}/${Date.now()}.sock`;
    server.listen(
      {
        path: sockPath
      },
      callback
    );

    const cleanUpHandler = cleanUp(sockPath);

    process.on('exit', cleanUpHandler);
    process.on('uncaughtException', cleanUpHandler);

    process.on('SIGINT', cleanUpHandler);
    process.on('SIGTERM', cleanUpHandler);
  }
}

/** export mainLoop function */
module.exports = mainLoop;