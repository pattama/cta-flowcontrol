'use strict';

const assert = require('chai').assert;
const path = require('path');
const config = require('../../lib/config');

describe('config', function() {
  it('should throw an error if invalid dir', function(done) {
    try {
      const conf = config(`${Date.now()}`);
      done('should throw an error');
    } catch (e) {
      console.error(e);
      done();
    }
  });

  it('should merge config files', function() {
    const conf = config(path.resolve(__dirname, 'config.testdata'));
    assert.deepEqual(conf, {
      logger: {
        module: 'cta-logger',
        properties: {
          level: 'debug',
        },
      },
      bricks: [
        {
          name: 'a',
          module: 'cta-brick',
        },
        {
          name: 'b',
          module: 'cta-brick',
        },
      ],
    });
  });
});
