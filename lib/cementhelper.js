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
   * @param {object} logger - logger instance
   */
  constructor(cement, brickName, logger) {
    if (typeof brickName !== 'string') {
      throw new TypeError('incorrect brickName');
    }
    this.cement = cement;
    this.brickName = brickName;
    this.logger = logger;
  }

  /**
   * Returns a new Context
   * @param {Job} data - the data to publish
   * @return {Context}
   */
  createContext(data) {
    return new Context(this, data);
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
  health(status) {
    this.cement.health(this.brickName, status);
  }
}

exports = module.exports = CementHelper;
