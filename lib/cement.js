'use strict';
const CementHelper = require('./cement-helper');
const Channel = require('./channel');

/**
 * Cement class
 * @class
 * @property {Map<CementBrick>} bricks - Map of a CementBrick
 */
class Cement {
  /**
   * Creates a new Cement instance
   * @constructs Cement
   * @param {CementConfig} configuration - configuration object for instantiating a new Cement
   */
  constructor(configuration) {
    this.validate(configuration);

    // Instantiating all Bricks
    this.bricks = new Map();
    this.channels = new Map();
    configuration.bricks.forEach((brickConfig, brickIndex) => {
      let cementHelper;
      try {
        cementHelper = new CementHelper(this, brickConfig.name);
      } catch (error) {
        throw (new Error(`failed to instantiate new cementHelper in bricks[${brickIndex}]: ${error}`));
      }

      let BrickConstructor;
      try {
        BrickConstructor = require(brickConfig.module);
      } catch (error) {
        throw (new Error(`failed to load module '${brickConfig.module}' in bricks[${brickIndex}]: ${error}`));
      }

      let BrickInstance;
      try {
        BrickInstance = new BrickConstructor(cementHelper, brickConfig);
      } catch (error) {
        throw (new Error(`failed to instantiate new '${brickConfig.module}' in bricks[${brickIndex}]: ${error}`));
      }

      this.bricks.set(brickConfig.name, {
        configuration: brickConfig,
        cementHelper: cementHelper,
        instance: BrickInstance,
      });

      if (Array.isArray(brickConfig.publish)) {
        brickConfig.publish.forEach((pubContract) => {
          if (!this.channels.has(pubContract.topic)) {
            this.channels.set(pubContract.topic, new Channel(pubContract.topic));
          }
          this.channels.get(pubContract.topic).addPublisher(brickConfig.name, pubContract.data);
        });
      }

      if (Array.isArray(brickConfig.subscribe)) {
        brickConfig.subscribe.forEach((subContract) => {
          if (!this.channels.has(subContract.topic)) {
            this.channels.set(subContract.topic, new Channel(subContract.topic));
          }
          this.channels.get(subContract.topic).addSubscriber(brickConfig.name, subContract.data);
        });
      }
    });
  }

  /**
   * Validate all the configuration properties
   * @param {CementConfig} configuration - configuration object for instantiating a new Cement
   */
  validate(configuration) {
    if (!(Array.isArray(configuration.bricks))) {
      throw new TypeError('bricks type is not Array');
    }

    const uniqueNames = [];
    configuration.bricks.forEach((brickConfig, brickIndex) => {
      if (!('name' in brickConfig) || typeof brickConfig.name !== 'string') {
        throw (new Error(`missing/incorrect 'name' string property in bricks[${brickIndex}]`));
      }

      if (uniqueNames.indexOf(brickConfig.name) !== -1) {
        throw (new Error(`bricks[${brickIndex}] name '${brickConfig.name}' is not unique`));
      }
      uniqueNames.push(brickConfig.name);

      if (!('module' in brickConfig) || typeof brickConfig.module !== 'string') {
        throw (new Error(`missing/incorrect 'module' string property in bricks[${brickIndex}]`));
      }

      if ('properties' in brickConfig) {
        if (typeof brickConfig.properties !== 'object') {
          throw (new Error(`incorrect 'properties' object property in bricks[${brickIndex}]`));
        }
      }

      if ('publish' in brickConfig) {
        if (!Array.isArray(brickConfig.publish)) {
          throw (new Error(`incorrect 'publish' Array property in bricks[${brickIndex}]`));
        } else {
          const uniquePubNames = [];
          brickConfig.publish.forEach((pub, pubIndex) => {
            if (!('topic' in pub) || typeof pub.topic !== 'string') {
              throw (new Error(`missing/incorrect 'topic' string property in bricks[${brickIndex}].publish[${pubIndex}]`));
            }

            if (uniquePubNames.indexOf(pub.topic) !== -1) {
              throw (new Error(`publish contract '${pub.topic}' is declared more than once`));
            }
            uniquePubNames.push(pub.topic);

            if ('data' in pub) {
              if (!Array.isArray(pub.data)) {
                throw (new Error(`incorrect 'data' Array property in bricks[${brickIndex}].publish[${pubIndex}]`));
              } else if (pub.data.length === 0) {
                throw (new Error(`empty 'data' Array property in bricks[${brickIndex}].publish[${pubIndex}]`));
              }
            }
          });
        }
      }

      if ('subscribe' in brickConfig) {
        if (!Array.isArray(brickConfig.subscribe)) {
          throw (new Error(`incorrect 'subscribe' Array property in bricks[${brickIndex}]`));
        } else {
          const uniqueSubNames = [];
          brickConfig.subscribe.forEach((sub, pubIndex) => {
            if (!('topic' in sub) || typeof sub.topic !== 'string') {
              throw (new Error(`missing/incorrect 'topic' string property in bricks[${brickIndex}].subscribe[${pubIndex}]`));
            }

            if (uniqueSubNames.indexOf(sub.topic) !== -1) {
              throw (new Error(`subscribe contract '${sub.topic}' is declared more than once`));
            }
            uniqueSubNames.push(sub.topic);

            if ('data' in sub) {
              if (!Array.isArray(sub.data)) {
                throw (new Error(`incorrect 'data' Array property in bricks[${brickIndex}].subscribe[${pubIndex}]`));
              } else if (sub.data.length === 0) {
                throw (new Error(`empty 'data' Array property in bricks[${brickIndex}].subscribe[${pubIndex}]`));
              }
            }
          });
        }
      }
    });
  }

  /**
   * Get publishing channels of a brick
   * If data is provided, get only channels where data contract is fulfilled
   * @param {String} name - name of the brick
   * @param {Object} [data] - data to be published
   * @return {Channel[]}
   */
  getDestinations(name, data) {
    if (typeof name !== 'string') {
      throw (new Error('missing/incorrect \'name\' string property'));
    }
    const results = Array.from(this.channels) // convert Map to [(key, value)] array
      .map((keyValuePair) => keyValuePair[1]) // map to [value] array
      .filter((channel) => {
        let filterCondition = channel.publishers.has(name);
        if (data !== null && typeof data === 'object') {
          filterCondition &= channel.canProduce(name, data);
        }
        return filterCondition;
      });
    return results;
  }

  /**
   * Publish a Context to all the links of the Brick which created it
   * @param {Context} context - the context to publish
   */
  publish(context) {
    const self = this;
    const source = this.bricks.get(context.from);
    if ('publish' in source.configuration) {
      source.configuration.publish.forEach((publish) => {

      });
    }
  }
}

exports = module.exports = Cement;

/**
 * @typedef {Object} CementBrick
 * @property {BrickConfig} configuration - the configuration data of the Brick
 * @property {CementHelper} cementHelper - the instance of CementHelper related to the Brick
 * @property {Brick} instance - the instance of the Brick
 */

/**
 * @typedef {Object} JobDefinition
 * @property {String} type - type of Jobs that should be permitted
 * @property {String} quality - quality of Jobs that should be permitted
 * @property {Boolean} [except] - if true, deny Jobs instead of permitting. Permit everything else.
 */

/**
 * @typedef {Object} CementConfig
 * @property {BrickConfig[]} bricks - array of brick configurations
 */

/**
 * @typedef {Object} BrickConfig
 * @property {String} name - name of the brick instance (should be unique)
 * @property {String} module - path or name of the brick module
 * @property {Object} [properties] - properties to instantiate the brick (see the module definition)
 * @property {Contract[]} [publish] - Array of Contract for publishing data
 * @property {Contract[]} [subscribe] - Array of Contract for subscribing to data
 */

/**
 * @typedef {Object} Contract
 * @property {String} topic - the topic of the data (e.g. channel)
 * @property {Object[]} data - Array of data definition
 */

/**
 * @typedef {Object} LinkConfig
 * @property {String} name - name of the brick instance to link (a BrickConfig defining it should exist)
 * @property {JobDefinition[]} [jobs] - array of definitions of Jobs (e.g. nature) permitted or denied to be sent. If empty or undefined, all data will be permitted.
 */
