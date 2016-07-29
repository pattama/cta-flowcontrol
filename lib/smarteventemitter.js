'use strict';
const EventEmitter = require('events');

/**
 * SmartEventEmitter class
 * @class
 * @property {Set<String>} authorizedEvents - Set of authorized events
 */
class SmartEventEmitter extends EventEmitter {
  /**
   * Creates a SmartEventEmitter instance
   */
  constructor() {
    super();
    this.authorizedEvents = new Set();
    this.authorizedEvents.add('error');
  }

  /**
   * Add events to the authorizedEvents Set
   * @param {Array<String>} authorizedEvents - Array of authorized events
   */
  setAuthorizedEvents(authorizedEvents) {
    authorizedEvents.forEach((event) => {
      this.authorizedEvents.add(event);
    });
  }

  on(eventName, listener) {
    if (!this.authorizedEvents.has(eventName)) {
      throw new Error(`Adding listener to event '${eventName}' is not authorized.`);
    } else {
      super.on(eventName, listener);
      return this;
    }
  }

  once(eventName, listener) {
    if (!this.authorizedEvents.has(eventName)) {
      throw new Error(`Adding listener to event '${eventName}' is not authorized.`);
    } else {
      super.once(eventName, listener);
      return this;
    }
  }

  addListener(eventName, listener) {
    if (!this.authorizedEvents.has(eventName)) {
      throw new Error(`Adding listener to event '${eventName}' is not authorized.`);
    } else {
      super.addListener(eventName, listener);
      return this;
    }
  }

  emit() {
    if (!this.authorizedEvents.has(arguments[0])) {
      throw new Error(`Emitting event '${arguments[0]}' is not authorized.`);
    } else {
      return super.emit.apply(this, arguments);
    }
  }

  // todo: when updating to node 6.0+, should also wrap 'prependListener' and 'prependOnceListener' methods
}

module.exports = SmartEventEmitter;
