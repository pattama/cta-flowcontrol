'use strict';
const Context = require('./context');

/**
 * CementHelper class
 * @class
 * @property {Cement} cement - Map of a CementBrick
 * @property {String} brickName - the name of the Brick
 */
class CementHelper {
  /**
   * Creates a new CementHelper
   * @constructs CementHelper
   * @param {Cement} cement - Map of a CementBrick
   * @param {String} brickName - the name of the Brick
   */
  constructor(cement, brickName) {
    if (typeof brickName !== 'string') {
      throw new TypeError('incorrect brickName');
    }
    this.cement = cement;
    this.brickName = brickName;
  }

  /**
   * Returns a new Context
   * @param {Object} data - the data to send
   * @return {Context}
   */
  createContext(data) {
    return new Context(this, data);
  }

  /**
   * Sends a Context
   * @param {Context} context - the context to send
   */
  send(context) {
    this.cement.send(context);
  }
}

exports = module.exports = CementHelper;
