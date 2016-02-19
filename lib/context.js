'use strict';
const EventEmitter = require('events');

/**
 * Context class
 * @class
 * @property {CementHelper} cementHelper
 * @property {String} from - the name of the brick which created this Context
 * @property {Object} data - the data to send
 */
class Context extends EventEmitter {
  /**
   * Creates a new Context
   * @constructs Context
   * @property {CementHelper} cementHelper
   * @property {Object} data - the data to send
   */
  constructor(cementHelper, data) {
    super();
    this.cementHelper = cementHelper;
    this.from = cementHelper.brickName;
    this.data = data;
  }

  /**
   * Sends this Context
   */
  send() {
    this.cementHelper.send(this);
  }
}

exports = module.exports = Context;
