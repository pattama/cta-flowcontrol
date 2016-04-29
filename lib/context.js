'use strict';
const EventEmitter = require('events');
const defaultLogger = require('cta-logger');
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
    this.logger = 'cement' in cementHelper ? cementHelper.cement.logger : defaultLogger();
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
    const that = this;
    this.on('accept', function onContextAccept(who) {
      that.logger.info(`${that.from}: ${who} accepted`);
    })
    .on('reject', function onContextReject(who, reject) {
      that.logger.error(`${that.from}: ${who} rejected with`, reject);
    })
    .on('done', function onContextDone(who, res) {
      that.logger.info(`${that.from}: ${who} done with ${JSON.stringify(res)}`);
    })
    .on('error', function onContextError(who, err) {
      that.logger.error(`${that.from}: ${who} failed with`, err);
    });
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
