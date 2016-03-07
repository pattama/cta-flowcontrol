'use strict';
const _ = require('lodash');

/**
 * Channel class
 * @class
 * @property {String} topic - the topic (e.g. name) of the channel
 * @property {Map<>} publishers - Map of the expected publishers
 * @property {Map} subscribers - Map of the expected subscribers
 */
class Channel {
  /**
   * Creates a new Channel
   * @constructs Channel
   * @property {String} topic
   */
  constructor(topic) {
    if (typeof topic !== 'string') {
      throw (new Error('missing/incorrect \'topic\' string property'));
    }

    this.topic = topic;
    this.publishers = new Map();
    this.subscribers = new Map();
  }

  /**
   * Adds a publisher and its data contracts
   * If already exists, retrieves the publisher and adds the new contracts
   * @property {String} name - name of the publisher
   * @property {Object[]} data - Array of data contracts
   */
  addPublisher(name, data) {
    if (typeof name !== 'string') {
      throw (new Error('missing/incorrect \'name\' string property'));
    }
    if (!Array.isArray(data)) {
      throw (new Error(`missing/incorrect 'data' Array property`));
    } else if (data.length === 0) {
      throw (new Error(`empty 'data' Array property`));
    }

    if (this.publishers.has(name)) {
      const concat = this.publishers.get(name).concat(data);
      this.publishers.set(name, concat);
    } else {
      this.publishers.set(name, data);
    }

    return this;
  }

  /**
   * Checks if a publisher can produce some data on this channel
   * @property {String} name - name of the publisher
   * @property {Object} data - data to produce
   */
  canProduce(name, data) {
    if (typeof name !== 'string') {
      throw (new Error('missing/incorrect \'name\' string property'));
    }
    if (data === null || typeof data !== 'object') {
      throw (new Error(`missing/incorrect 'data' object property`));
    }

    let result = false;
    if (this.publishers.has(name)) {
      result = this.publishers.get(name).some((dataContract) => {
        return _.isMatch(data, dataContract);
      });
    }

    return result;
  }

  /**
   * Adds a subscriber and its data contracts
   * If already exists, retrieves the subscriber and adds the new contracts
   * @property {String} name - name of the subscriber
   * @property {Object[]} data - Array of data contracts
   */
  addSubscriber(name, data) {
    if (typeof name !== 'string') {
      throw (new Error('missing/incorrect \'name\' string property'));
    }
    if (!Array.isArray(data)) {
      throw (new Error(`missing/incorrect 'data' Array property`));
    } else if (data.length === 0) {
      throw (new Error(`empty 'data' Array property`));
    }

    if (this.subscribers.has(name)) {
      const concat = this.subscribers.get(name).concat(data);
      this.subscribers.set(name, concat);
    } else {
      this.subscribers.set(name, data);
    }

    return this;
  }

  /**
   * Checks if a subscriber can consume some data on this channel
   * @property {String} name - name of the subscriber
   * @property {Object} data - data to consume
   * @return {Boolean}
   */
  canConsume(name, data) {
    if (typeof name !== 'string') {
      throw (new Error('missing/incorrect \'name\' string property'));
    }
    if (data === null || typeof data !== 'object') {
      throw (new Error(`missing/incorrect 'data' object property`));
    }

    let result = false;
    if (this.subscribers.has(name)) {
      result = this.subscribers.get(name).some((dataContract) => {
        return _.isMatch(data, dataContract);
      });
    }

    return result;
  }

  /**
   * Gets if a subscriber can consume some data on this channel
   * @property {String} name - name of the subscriber
   * @property {Object} data - data to consume
   * @return {String[]}
   */
  getSubscribers(data) {
    if (data === null || typeof data !== 'object') {
      throw (new Error(`missing/incorrect 'data' object property`));
    }
    const results = Array.from(this.subscribers) // convert Map to [(key, value)] array
      .filter((subContract) => {
        return subContract[1].some((dataContract) => {
          return _.isMatch(data, dataContract);
        });
      }).map((subContract) => { // map to [key] Array
        return subContract[0];
      });
    return results;
  }
}

exports = module.exports = Channel;
