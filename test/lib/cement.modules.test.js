'use strict';

const flowControl = require('cta-flowcontrol');
const config = require('./cement.modules.testdata/config');
const assert = require('chai').assert;

const Cement = flowControl.Cement;
const cement = new Cement(config);

describe('cement modules loader', () => {
  it('should load all modules in configuration', () => {
    assert.property(cement, 'modules');
    assert.property(cement.modules, 'logger');
    assert.property(cement.modules, 'messaging');
    assert.property(cement.modules, 'healthCheck');
  });
  it('should inject modules dependencies', () => {
    const messaging = cement.modules.messaging;
    const healthCheck = cement.modules.healthCheck;

    assert.property(messaging, 'dependencies');
    assert.property(messaging.dependencies, 'logger');

    assert.property(healthCheck, 'dependencies');
    assert.property(healthCheck.dependencies, 'logger');
    assert.property(healthCheck.dependencies, 'messaging');
  });
  it('should inject bricks dependencies', () => {
    const one = cement.bricks.get('one').instance;
    const two = cement.bricks.get('two').instance;
    const three = cement.bricks.get('three').instance;

    assert.property(one, 'dependencies');
    assert.property(one.dependencies, 'logger');
    assert.property(one.dependencies, 'messaging');
    assert.property(one.dependencies, 'healthCheck');

    assert.property(two, 'dependencies');
    assert.property(two.dependencies, 'logger');
    assert.notProperty(two.dependencies, 'messaging');
    assert.notProperty(two.dependencies, 'healthCheck');

    assert.property(three, 'dependencies');
    assert.notProperty(three.dependencies, 'logger');
    assert.notProperty(three.dependencies, 'messaging');
    assert.property(three.dependencies, 'healthCheck');
  });
});

