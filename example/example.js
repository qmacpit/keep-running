'use strict';

const keepRunning = require('../src');

keepRunning.init()(() => console.log('running forever....'));