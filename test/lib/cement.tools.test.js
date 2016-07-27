'use strict';

const flowControl = require('cta-flowcontrol');
const config = require('./cement.tools.testdata/config');
const assert = require('chai').assert;

const Cement = flowControl.Cement;
const cement = new Cement(config);
describe('cement tools loader', () => {
  it('should load all tools in configuration', () => {
    assert.property(cement, 'tools');
    assert.property(cement.tools, 't0');
    assert.property(cement.tools, 't1');
    assert.property(cement.tools, 't2');
    assert.property(cement.tools, 't3');
    assert.property(cement.tools, 't4');
    assert.property(cement.tools, 't5');
  });

  const t0 = cement.tools.t0;
  const t1 = cement.tools.t1;
  const t2 = cement.tools.t2;
  const t3 = cement.tools.t3;
  const t4 = cement.tools.t4;
  const t5 = cement.tools.t5;

  context('tools\'s dependencies', () => {
    it('should inject tools that are scoped "all"', () => {
      // t1 has scope 'all'
      assert.property(t0.dependencies, 't1');
      assert.property(t2.dependencies, 't1');
      assert.property(t3.dependencies, 't1');
      assert.property(t4.dependencies, 't1');
      assert.property(t5.dependencies, 't1');
    });
    it('should inject tools that are scoped "tools"', () => {
      // t2 has scope 'tools'
      assert.property(t0.dependencies, 't2');
      assert.property(t1.dependencies, 't2');
      assert.property(t3.dependencies, 't2');
      assert.property(t4.dependencies, 't2');
      assert.property(t5.dependencies, 't2');
    });
    it('should inject other dependencies', () => {
      assert.property(t4.dependencies, 't4t0');
      assert.property(t5.dependencies, 't5t0');
      assert.property(t5.dependencies, 't5t4');
    });
    it('should not inject unwanted dependencies', () => {
      assert.notProperty(t0.dependencies, 't0');
      assert.notProperty(t0.dependencies, 't3');
      assert.notProperty(t0.dependencies, 't4');
      assert.notProperty(t0.dependencies, 't5');

      assert.notProperty(t1.dependencies, 't0');
      assert.notProperty(t1.dependencies, 't1');
      assert.notProperty(t1.dependencies, 't3');
      assert.notProperty(t1.dependencies, 't4');
      assert.notProperty(t1.dependencies, 't5');
    });
  });
  context('bricks\'s dependencies', () => {
    const b1 = cement.bricks.get('b1').instance;
    const b2 = cement.bricks.get('b2').instance;
    const b3 = cement.bricks.get('b3').instance;
    it('should inject tools that are scoped "all"', () => {
      // t1 has scope 'all'
      assert.property(b1.dependencies, 't1');
      assert.property(b2.dependencies, 't1');
      assert.property(b3.dependencies, 't1');
    });
    it('should inject tools that are scoped "bricks"', () => {
      // t3 has scope 'bricks'
      assert.property(b1.dependencies, 't3');
      assert.property(b2.dependencies, 't3');
      assert.property(b3.dependencies, 't3');
    });
    it('should inject other dependencies', () => {
      assert.property(b1.dependencies, 'b1t2');
      assert.property(b1.dependencies, 'b1t0');
      assert.property(b2.dependencies, 'b2t5');
      assert.property(b2.dependencies, 't3');
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

