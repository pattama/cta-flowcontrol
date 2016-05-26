'use strict';
const _ = require('lodash');

/**
 * Channel class
 * @class
 * @property {String} topic - the topic (e.g. name) of the channel
 * @property {Map<Client>} publishers - Map of the expected publishers (data contract and brick instance)
 * @property {Map<Client>} subscribers - Map of the expected subscribers (data contract and brick instance)
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
   * @property {Object} brick - Brick instance
   */
  addPublisher(name, data, brick) {
    if (typeof name !== 'string') {
      throw (new Error('missing/incorrect \'name\' string property'));
    }
    if (!Array.isArray(data)) {
      throw (new Error(`missing/incorrect 'data' Array property`));
    } else if (data.length === 0) {
      throw (new Error(`empty 'data' Array property`));
    }
    if (brick === null || typeof brick !== 'object') {
      throw (new Error(`missing/incorrect 'brick' object property`));
    }

    if (this.publishers.has(name)) {
      const concat = this.publishers.get(name).data.concat(data);
      this.publishers.set(name, {
        data: concat,
        brick: brick,
      });
    } else {
      this.publishers.set(name, {
        data: data,
        brick: brick,
      });
    }

    return this;
  }

  /**
   * Checks if a publisher can publish some data on this channel
   * @property {String} name - name of the publisher
   * @property {Object} data - data to publish
   */
  canPublish(name, data) {
    if (typeof name !== 'string') {
      throw (new Error('missing/incorrect \'name\' string property'));
    }
    if (data === null || typeof data !== 'object') {
      throw (new Error(`missing/incorrect 'data' object property`));
    }

    let result = false;
    if (this.publishers.has(name)) {
      result = this.publishers.get(name).data.some((dataContract) => {
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
   * @property {Object} brick - Brick instance
   */
  addSubscriber(name, data, brick) {
    if (typeof name !== 'string') {
      throw (new Error('missing/incorrect \'name\' string property'));
    }
    if (!Array.isArray(data)) {
      throw (new Error(`missing/incorrect 'data' Array property`));
    } else if (data.length === 0) {
      throw (new Error(`empty 'data' Array property`));
    }
    if (brick === null || typeof brick !== 'object') {
      throw (new Error(`missing/incorrect 'brick' object property`));
    }

    if (this.subscribers.has(name)) {
      const concat = this.subscribers.get(name).data.concat(data);
      this.subscribers.set(name, {
        data: concat,
        brick: brick,
      });
    } else {
      this.subscribers.set(name, {
        data: data,
        brick: brick,
      });
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
      result = this.subscribers.get(name).data.some((dataContract) => {
        return _.isMatch(data, dataContract);
      });
    }

    return result;
  }

  /**
   * Gets names of subscribers that can consume specified data on this channel
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
        return subContract[1].data.some((dataContract) => {
          return _.isMatch(data, dataContract);
        });
      }).map((subContract) => { // map to [key] Array
        return subContract[0];
      });
    return results;
  }

  /**
   * Publishes a message on this channel and make subscribers consume it
   * @property {Context} context - Context to publish
   */
  publish(context) {
    const subscribers = this.getSubscribers(context.data).map((name)=> {
      return this.subscribers.get(name);
    });
    if (subscribers.length === 0) {
      context.emit('error', null, new Error('no brick is subscribed to consume the job'));
    } else {
      subscribers.forEach((subscriber) => {
        subscriber.brick.validate(context).then(() => {
          context.emit('accept', subscriber.brick.name, context.data);
          subscriber.brick.process(context);
        }).catch((err) => {
          context.emit('reject', subscriber.brick.name, err);
        });
      });
    }
    return this;
  }
}

exports = module.exports = Channel;

/**
 * @typedef {Object} Client
 * @property {String} key - name of the brick
 * @property {Object} value
 * @property {Object[]} value.data - Array of data contracts
 * @property {Object} value.instance - instance of brick
 */
