'use strict';

const assert = require('chai').assert;
const Cement = require('../../lib/cement');

describe('Cement - init', () => {
  it('should init all bricks', (done) => {
    const config = require('./cement.init.bricks.testdata/config12');
    const cement = new Cement(config);
    cement.on('bootstrapped', () => {
      done();
    });
  });
  it('should throw init error', (done) => {
    const config = require('./cement.init.bricks.testdata/config123');
    const cement = new Cement(config);
    cement.on('bootstrapped', (data) => {
      assert.fail(data, null, 'should not be bootstrapped');
      done();
    });
    cement.on('error', (err) => {
      console.log('error: ', err);
      done();
    });
  });
});
