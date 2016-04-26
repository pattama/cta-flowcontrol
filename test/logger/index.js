'use strict';
const assert = require('chai').assert;
const os = require('os');
const path = require('path');
const fs = require('fs');

describe('logger', function() {
  it('cement with default logger config', function(done) {
    const Cement = require('../../lib/cement');
    const config = require('./config');
    const cement = new Cement(config);
    // default cement log filename
    const logFile = os.tmpDir() + path.sep + 'cta-flowcontrol.log';
    setTimeout(function() {
      fs.readFile(logFile, 'utf8', (err, data) => {
        if (err) {
          done(err);
        }
        const str = new Date().toISOString().substring(0, 16);
        assert(data.indexOf(str) !== -1);
        done();
      });
    }, 500);
  });
  it('cement with custom logger config', function(done) {
    const Cement = require('../../lib/cement');
    const config = require('./config');
    const logFile = os.tmpDir() + path.sep + 'cta-flowcontrol-' + Date.now() + '.log';
    config.logger = {
      properties: {
        filename: logFile,
        level: 'debug',
      },
    };
    const cement = new Cement(config);
    setTimeout(function() {
      fs.readFile(logFile, 'utf8', (err, data) => {
        if (err) {
          done(err);
        }
        const str = new Date().toISOString().substring(0, 16);
        assert(data.indexOf(str) !== -1);
        done();
      });
    }, 500);
  });
});
