'use strict';
const DEFAULTCONTEXTEVENTS = require('./contextevents');
const SmartEventEmitter = require('./smarteventemitter');
const DefaultLogger = require('cta-logger');
/**
 * Context class
 * @class
 * @property {CementHelper} cementHelper
 * @property {String} from - the name of the brick which created this Context
 * @property {Job} data - the data to publish
 * @property {Set<String>} authorizedEvents - events for which listeners can be added
 */
class Context extends SmartEventEmitter {
  /**
   * Creates a new Context
   * @constructs Context
   * @param {CementHelper} cementHelper
   * @param {Job} data - the data to publish
   * @param {Array<String>} [events] - additionnal events to authorize
   */
  constructor(cementHelper, data, events) {
    super();

    this.cementHelper = cementHelper;
    this.from = cementHelper.brickName;
    this.logger = cementHelper.hasOwnProperty('cement') ? cementHelper.cement.logger : new DefaultLogger();

    if (events && !Array.isArray(events)) {
      throw (new Error('incorrect \'events\' Array argument'));
    }
    this.setAuthorizedEvents(DEFAULTCONTEXTEVENTS.concat(events));

    this.data = data;
  }

  /**
   * Publish this Context
   */
  publish() {
    const that = this;
    this.on('accept', function onContextAccept(who) {
      that.logger.verbose(`${that.from}: ${who} accepted`);
    })
    .on('reject', function onContextReject(who, reject) {
      const message = reject instanceof Error ? reject.message : reject;
      that.logger.error(`${that.from}: ${who} rejected with: `, message);
    })
    .on('done', function onContextDone(who, res) { // eslint-disable-line no-unused-vars
      that.logger.verbose(`${that.from}: ${who} done`);
    })
    .on('error', function onContextError(who, err) {
      const message = err instanceof Error ? err.message : err;
      that.logger.error(`${that.from}: ${who} failed with`, message);
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
