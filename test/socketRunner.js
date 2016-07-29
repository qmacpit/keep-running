'use strict';

const keepRunning = require('../src');

const mode = process.env.MODE;
const tmpDir = process.env.TMP_DIR;

keepRunning.init(mode)(() => {});