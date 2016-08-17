'use strict';

const flowControl = require('cta-flowcontrol');
const config = require('./cement.tools.testdata/config');
const assert = require('chai').assert;
const T0 = require('./cement.tools.testdata/t0.js');
const T1 = require('./cement.tools.testdata/t1.js');
const T2 = require('./cement.tools.testdata/t2.js');
const T3 = require('./cement.tools.testdata/t3.js');

const Cement = flowControl.Cement;
const cement = new Cement(config);

describe('cement tools loader', () => {
  it('should instantiate all tools in configuration', () => {
    assert.property(cement, 'tools');
    assert.property(cement.tools, 't0');
    assert.instanceOf(cement.tools.t0, T0);
    assert.property(cement.tools, 't1');
    assert.instanceOf(cement.tools.t1, T1);
    assert.property(cement.tools, 't2');
    assert.instanceOf(cement.tools.t2, T2);
    assert.property(cement.tools, 't3');
    assert.instanceOf(cement.tools.t3, T3);
  });

  const t0 = cement.tools.t0;
  const t1 = cement.tools.t1;
  const t2 = cement.tools.t2;
  const t3 = cement.tools.t3;

  describe('tools\'s dependencies', () => {
    it('should inject cement dependency in all tools', () => {
      assert.property(t0.dependencies, 'cement');
      assert.deepEqual(t0.dependencies.cement, cement);

      assert.property(t1.dependencies, 'cement');
      assert.deepEqual(t1.dependencies.cement, cement);

      assert.property(t2.dependencies, 'cement');
      assert.deepEqual(t2.dependencies.cement, cement);

      assert.property(t3.dependencies, 'cement');
      assert.deepEqual(t3.dependencies.cement, cement);
    });
    it('should inject tools that are scoped "all"', () => {
      // t0 has the scope 'all'
      assert.property(t1.dependencies, 't0');
      assert.instanceOf(t1.dependencies.t0, T0);

      assert.property(t2.dependencies, 't0');
      assert.instanceOf(t2.dependencies.t0, T0);

      assert.property(t3.dependencies, 't0');
      assert.instanceOf(t3.dependencies.t0, T0);
    });
    it('should inject custom dependencies', () => {
      // t2 & t3 have custom dependencies
      assert.property(t2.dependencies, 't1');
      assert.instanceOf(t2.dependencies.t1, T1);

      assert.property(t3.dependencies, 't3a');
      assert.instanceOf(t3.dependencies.t3a, T1);

      assert.property(t3.dependencies, 't3b');
      assert.instanceOf(t3.dependencies.t3b, T2);
    });
    it('should not inject unwanted dependencies', () => {
      assert.notProperty(t0.dependencies, 't0');
      assert.notProperty(t0.dependencies, 't1');
      assert.notProperty(t0.dependencies, 't2');
      assert.notProperty(t0.dependencies, 't3');

      assert.notProperty(t1.dependencies, 't1');
      assert.notProperty(t1.dependencies, 't2');
      assert.notProperty(t1.dependencies, 't3');

      assert.notProperty(t2.dependencies, 't2');
      assert.notProperty(t2.dependencies, 't3');

      assert.notProperty(t3.dependencies, 't1');
      assert.notProperty(t3.dependencies, 't2');
      assert.notProperty(t3.dependencies, 't3');
    });
  });

  describe('bricks\'s dependencies', () => {
    const b1 = cement.bricks.get('b1').instance;
    const b2 = cement.bricks.get('b2').instance;
    const b3 = cement.bricks.get('b3').instance;
    it('should inject tools that are scoped "all"', () => {
      // t0 has scope 'all'
      assert.property(b1.dependencies, 't0');
      assert.instanceOf(b1.dependencies.t0, T0);

      assert.property(b2.dependencies, 't0');
      assert.instanceOf(b2.dependencies.t0, T0);

      // b3 override t0 dependency
    });
    it('should inject tools that are scoped "bricks"', () => {
      // t1 has scope 'bricks'
      assert.property(b1.dependencies, 't1');
      assert.instanceOf(b1.dependencies.t1, T1);

      assert.property(b2.dependencies, 't1');
      assert.instanceOf(b2.dependencies.t1, T1);

      assert.property(b3.dependencies, 't1');
      assert.instanceOf(b3.dependencies.t1, T1);
    });
    it('should inject custom dependencies', () => {
      assert.property(b2.dependencies, 't2');
      assert.instanceOf(b2.dependencies.t2, T2);

      assert.property(b3.dependencies, 't0');
      assert.instanceOf(b3.dependencies.t0, T3); // b3 override t0 dependency
    });
  });
  it('should throw an error if a tool is not found', () => {
    config.tools.push({
      name: 'unknown',
      module: 'unknown',
    });
    try {
      const cement2 = new Cement(config);
    } catch (err) {
      assert(err);
      return;
    }
    assert.fail('should throw an error');
  });
});

