'use strict';

const MODE = {
  SOCKET: 'socket'
}

const init = (mode) => {
  mode = mode || MODE.SOCKET;
  let keepRunning;
  try {
    keepRunning = require(`./${mode}`);
  } catch (e) {
    throw new Error('inappropriate mode');
  }
  return keepRunning;
}

module.exports.MODE = MODE;
module.exports.init = init;