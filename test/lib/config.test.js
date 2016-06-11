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
      a: {
        a1: 'a1',
        a2: 'a2',
      },
      b: [
        {
          name: 'b1',
          b11: 'b11',
          b12: 'b12',
        },
        {
          name: 'b2',
          b21: 'b21',
          b22: 'b22',
          b23: 'b23',
        },
      ],
      c: {
        c1: ['c11', 'c12'],
        c2: {
          c21: 'c21',
        },
      },
    });
  });
});
