'use strict';
const EventEmitter = require('events');

/**
 * Context class
 * @class
 * @property {CementHelper} cementHelper
 * @property {String} from - the name of the brick which created this Context
 * @property {Job} data - the data to publish
 */
class Context extends EventEmitter {
  /**
   * Creates a new Context
   * @constructs Context
   * @property {CementHelper} cementHelper
   * @property {Job} data - the data to publish
   */
  constructor(cementHelper, data) {
    super();
    this.cementHelper = cementHelper;
    this.from = cementHelper.brickName;

    //if (!('id' in data) || typeof data.id !== 'string') {
    //  throw (new Error('missing/incorrect \'id\' string property in data'));
    //}
    //if (!('nature' in data) || typeof data.nature !== 'object') {
    //  throw (new Error('missing/incorrect \'nature\' object property in data'));
    //}
    //
    //if (!('quality'in data.nature) || typeof data.nature.quality !== 'string') {
    //  throw (new Error('missing/incorrect \'quality\' string property in data.nature'));
    //}
    //
    //if (!('type'in data.nature) || typeof data.nature.type !== 'string') {
    //  throw (new Error('missing/incorrect \'type\' string property in data.nature'));
    //}
    //
    //if (!('payload' in data) || typeof data.payload !== 'object') {
    //  throw (new Error('missing/incorrect \'payload\' object property in data'));
    //}
    this.data = data;
  }

  /**
   * Publish this Context
   */
  publish() {
    this.cementHelper.publish(this);
    return this;
  }
}

exports = module.exports = Context;

/**
 * @typedef {Object} Job
 * @property {String} id - id of the job
 * @property {Object} nature - nature description of the job
 * @property {String} nature.quality - quality of the job
 * @property {String} nature.type - type of the job
 * @property {Object} payload - payload of the job
 */
