'use strict';

const flowControl = require('cta-flowcontrol');
const config = require('./cement.tools.testdata/config');
const assert = require('chai').assert;

const Cement = flowControl.Cement;
const cement = new Cement(config);

describe('cement tools loader', () => {
  it('should load all tools in configuration', () => {
    assert.property(cement, 'tools');
    assert.property(cement.tools, 'logger');
    assert.property(cement.tools, 'messaging');
    assert.property(cement.tools, 'healthcheck');
  });
  it('should inject tools dependencies (including global dependencies)', () => {
    const logger = cement.tools.logger;
    const messaging = cement.tools.messaging;
    const healthcheck = cement.tools.healthcheck;

    assert.property(logger, 'dependencies');
    assert.notProperty(logger.dependencies, 'logger');
    assert.notProperty(logger.dependencies, 'messaging');
    assert.notProperty(logger.dependencies, 'healthcheck');

    assert.property(messaging, 'dependencies');
    assert.property(messaging.dependencies, 'logger'); // global dependency
    assert.notProperty(messaging.dependencies, 'messaging');
    assert.notProperty(messaging.dependencies, 'healthcheck');

    assert.property(healthcheck, 'dependencies');
    assert.property(healthcheck.dependencies, 'logger'); // global dependency
    assert.property(healthcheck.dependencies, 'messaging');
    assert.notProperty(healthcheck.dependencies, 'healthcheck');
  });
  it('should inject bricks dependencies (including global dependencies)', () => {
    const one = cement.bricks.get('one').instance;
    const two = cement.bricks.get('two').instance;
    const three = cement.bricks.get('three').instance;

    assert.property(one.cementHelper, 'dependencies');
    assert.property(one.cementHelper.dependencies, 'logger'); // global dependency
    assert.property(one.cementHelper.dependencies, 'messaging');
    assert.notProperty(one.cementHelper.dependencies, 'healthcheck');

    assert.property(two.cementHelper, 'dependencies');
    assert.property(two.cementHelper.dependencies, 'logger'); // global dependency
    assert.notProperty(two.cementHelper.dependencies, 'messaging');
    assert.property(two.cementHelper.dependencies, 'healthcheck');

    assert.property(three.cementHelper, 'dependencies');
    assert.property(three.cementHelper.dependencies, 'logger'); // global dependency
    assert.property(three.cementHelper.dependencies, 'messaging');
    assert.property(three.cementHelper.dependencies, 'healthcheck');
  });
});

