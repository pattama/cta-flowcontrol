'use strict';
const assert = require('chai').assert;
const path = require('path');
const os = require('os');
const fs = require('fs');
const _ = require('lodash');
const Cement = require('../../lib/cement');
const config = _.cloneDeep(require('./cement-configuration.json'));
if (!config.tools) {
  config.tools = [];
}

describe('logger', () => {
  it('should instantiate a default logger when not provided in config', (done) => {
    try {
      // ensure we have no logger config
      config.tools = config.tools.filter((tool) => {
        return tool.module !== 'cta-logger';
      });
      const cement = new Cement(config);
      assert.property(cement, 'logger');
      assert.property(cement.logger, 'error');
      assert.property(cement.logger, 'warn');
      assert.property(cement.logger, 'info');
      assert.property(cement.logger, 'verbose');
      assert.property(cement.logger, 'debug');
      assert.property(cement.logger, 'silly');
      done();
    } catch (e) {
      assert.fail(e.message);
      done();
    }
  });

  it('should instantiate custom logger when provided in config', (done) => {
    // add custom logger config
    const logFile = os.tmpDir() + path.sep + 'cta-flowcontrol-test-' + Date.now() + '.log';
    config.name = 'test';
    config.tools = [{
      name: 'logger',
      module: 'cta-logger',
      properties: {
        filename: logFile,
        level: 'debug',
      },
    }];
    const cement = new Cement(config);
    assert.property(cement, 'logger');
    assert.property(cement.logger, 'error');
    assert.property(cement.logger, 'warn');
    assert.property(cement.logger, 'info');
    assert.property(cement.logger, 'verbose');
    assert.property(cement.logger, 'debug');
    assert.property(cement.logger, 'silly');
    const text = 'It is about ' + new Date() + ' right now!';
    cement.logger.info(text);
    setTimeout(function() {
      const data = fs.readFileSync(logFile).toString();
      fs.unlinkSync(logFile);
      console.log('data: ', data);
      assert(data.indexOf('TEST') !== -1);
      assert(data.indexOf('CEMENT') !== -1);
      assert(data.indexOf(text) !== -1);
      done();
    }, 100);
  });
});
