/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

'use strict';
const Context = require('./context');

/**
 * CementHelper class
 * @class
 * @property {Cement} cement - the Cement instance
 * @property {String} brickName - the name of the Brick
 */
class CementHelper {
  /**
   * Creates a new CementHelper
   * @constructs CementHelper
   * @param {Cement} cement - the Cement instance
   * @param {String} brickName - the name of the Brick
   * @param {object} dependencies - brick modules dependencies
   * @param {object} appProperties - application global properties
   */
  constructor(cement, brickName, dependencies, appProperties) {
    if (typeof brickName !== 'string') {
      throw new TypeError('incorrect brickName');
    }
    this.cement = cement;
    this.brickName = brickName;
    this.dependencies = dependencies;
    this.appProperties = appProperties;
  }

  /**
   * Returns module loaded by the  Cement wrapped require method
   * @param path
   * @returns {Module}
   */
  require(path) {
    return this.cement.require(path);
  }

  /**
   * Returns a new Context
   * @param {Job} data - the data to publish
   * @param {Array<String>} [events] - additionnal events to authorize
   * @return {Context}
   */
  createContext(data, events) {
    return new Context(this, data, events);
  }

  /**
   * Publish a Context
   * @param {Context} context - the context to publish
   */
  publish(context) {
    this.cement.publish(context);
  }

  /**
   * Push brick health to cement level
   * @param status
   */
  /* health(status) {
    this.cement.health(this.brickName, status);
  }*/
}

exports = module.exports = CementHelper;
