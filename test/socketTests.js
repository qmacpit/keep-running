'use strict';

const execFile = require('child_process').execFile;
const path = require('path');
const expect = require('chai').expect;

const keepRunning = require('../src');

const runKeepRunner = (fileName, env) => {
  let isRunning;
  const child = execFile(
    'node',
    [ path.join(__dirname, fileName) ],
    { env: Object.assign({}, process.env, env || {}) },
    (error, stdout, stderr) => {
      isRunning = false;
    }
  );
  isRunning = true;

  return {
    isRunning: () => isRunning,
    kill: () => child.kill('SIGTERM')
  }
}

const verifyIsRunning = (_keepRunner, done) => {
  setTimeout(() => {
    expect(_keepRunner.isRunning()).to.be.truthy;
    _keepRunner.kill();
    done()
  }, 2000);
}

describe('socket-suite', function() {

  this.timeout(5000);

  describe('postitive-tests', function() {

    it('should keep running - settings: default', function(done) {
      verifyIsRunning(runKeepRunner('socketRunner'), done);
    });

    it('should keep running - settings: temp directory', function(done) {
      verifyIsRunning(
        runKeepRunner(
          'socketRunner',
          {
            TMP_DIR: '/tmp'
          }
        ),
        done
      );
    });

    it('should keep running - settings: mode', function(done) {
      verifyIsRunning(
        runKeepRunner(
          'socketRunner',
          {
            MODE: 'socket'
          }
        ),
        done
      );
    });

    it('should keep running - settings: mode, directory', function(done) {
      verifyIsRunning(
        runKeepRunner(
          'socketRunner',
          {
            TMP_DIR: '/tmp',
            MODE: 'socket'
          }
        ),
        done
      );
    });

  });

  describe('negative-tests', function() {

    it('should throw - inappropriate mode', function() {
      expect(() => {
        keepRunning.init('mode_that_doesnt_exist')(() => {});
      }).to.throw(Error, 'inappropriate mode');
    });

    it('should throw - inappropriate temp directory', function() {
      let dirName = '/dir_that_doesnt_exist';
      expect(() => {
        keepRunning.init()(() => {}, dirName);
      }).to.throw(Error, `no such file or directory, stat '${dirName}'`);
    });

  })


})