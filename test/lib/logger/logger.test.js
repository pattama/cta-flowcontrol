'use strict';
const assert = require('chai').assert;
const path = require('path');
const fs = require('fs');
const logFile = __dirname + path.sep + 'cta-flowcontrol.log';

describe('logger', function() {
  before(function(done) {
    try {
      fs.unlink(logFile, function() {
        done();
      });
    } catch (e) {
      done();
    }
  });
  it('cement with default logger config', function(done) {
    try {
      const Cement = require('../../../lib/cement');
      const config = require('./config.testdata.js');
      const cement = new Cement(config);
      // default cement log filename
      assert(cement.logger);
      assert(cement.logger.info);
      done();
    } catch (e) {
      done(e);
    }
  });
  it('cement with custom logger config', function(done) {
    const Cement = require('../../../lib/cement');
    const config = require('./config.testdata');
    config.tools = [{
      name: 'logger',
      module: 'cta-logger',
      properties: {
        filename: logFile,
        level: 'debug',
      },
    }];
    const cement = new Cement(config);
    cement.logger.info('Hi there');
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
