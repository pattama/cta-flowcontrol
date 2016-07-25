'use strict';

const flowControl = require('cta-flowcontrol');
const config = require('./cement.tools.testdata/config');
const assert = require('chai').assert;

const Cement = flowControl.Cement;
const cement = new Cement(config);

describe('cement tools loader', () => {
  it('should load all modules in configuration', () => {
    assert.property(cement, 'tools');
    assert.property(cement.tools, 'logger');
    assert.property(cement.tools, 'messaging');
    assert.property(cement.tools, 'healthCheck');
  });
  it('should inject modules dependencies', () => {
    const messaging = cement.tools.messaging;
    const healthCheck = cement.tools.healthCheck;

    assert.property(messaging, 'dependencies');
    // assert.property(messaging.dependencies, 'logger');

    assert.property(healthCheck, 'dependencies');
    // assert.property(healthCheck.dependencies, 'logger');
    assert.property(healthCheck.dependencies, 'messaging');
  });
  it('should inject bricks dependencies', () => {
    const one = cement.bricks.get('one').instance;
    const two = cement.bricks.get('two').instance;
    const three = cement.bricks.get('three').instance;

    assert.property(one.cementHelper, 'dependencies');
    assert.property(one.cementHelper.dependencies, 'logger');
    assert.property(one.cementHelper.dependencies, 'messaging');
    assert.property(one.cementHelper.dependencies, 'healthCheck');

    assert.property(two.cementHelper, 'dependencies');
    assert.property(two.cementHelper.dependencies, 'logger');
    assert.notProperty(two.cementHelper.dependencies, 'messaging');
    assert.notProperty(two.cementHelper.dependencies, 'healthCheck');

    assert.property(three.cementHelper, 'dependencies');
    assert.notProperty(three.cementHelper.dependencies, 'logger');
    assert.notProperty(three.cementHelper.dependencies, 'messaging');
    assert.property(three.cementHelper.dependencies, 'healthCheck');
  });
});

