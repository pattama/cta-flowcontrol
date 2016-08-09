'use strict';

const CEMENTDEFAULTEVENTS = require('./cementevents');
const CementHelper = require('./cementhelper');
const Channel = require('./channel');
const SmartEventEmitter = require('./smarteventemitter');

  /**
 * Cement class
 * @class
 * @property {Map<CementBrick>} bricks - Map of a CementBrick
 */
class Cement extends SmartEventEmitter {
  /**
   * Creates a new Cement instance
   * @constructs Cement
   * @param {CementConfig} configuration - configuration object for instantiating a new Cement
   */
  constructor(configuration) {
    super();
    const that = this;

    this.validate(configuration);

    // Set authorized events
    this.setAuthorizedEvents(CEMENTDEFAULTEVENTS);

    // Instantiating Cement tools
    this.tools = {};
    if (Array.isArray(configuration.tools)) {
      configuration.tools.forEach((toolConfig) => {
        // TODO Manage circular dependencies
        // TODO Manage unique names
        let Tool;
        try {
          Tool = require(toolConfig.module);
        } catch (error) {
          throw (new Error(`failed to load module '${toolConfig.module}': ${error}`));
        }
        const toolDependencies = {};
        configuration.tools.filter((gTool) => {
          return (gTool.name !== toolConfig.name) && (gTool.scope === 'all' || gTool.scope === 'tools');
        }).forEach((gTool) => {
          toolDependencies[gTool.name] = that.tools[gTool.name];
        });
        if (typeof toolConfig.dependencies === 'object' && Object.keys(toolConfig.dependencies).length) {
          Object.keys(toolConfig.dependencies).forEach((dependency) => {
            const reference = toolConfig.dependencies[dependency];
            toolDependencies[dependency] = that.tools[reference];
          });
        }
        try {
          that.tools[toolConfig.name] = new Tool(toolDependencies, toolConfig);
        } catch (error) {
          throw (new Error(`failed to instantiate Tool name ${toolConfig.name}: ${error}`));
        }
      });
    }

    // Ensure we have logger tool
    if (!this.tools.logger) {
      const Logger = require('cta-logger');
      const logger = new Logger();
      this.logger = logger.author('cement');
    } else {
      this.logger = this.tools.logger.author('cement');
    }

    // Instantiating Cement Bricks
    this.configuration = configuration;
    this.bricks = new Map();
    this.channels = new Map();
    const initialized = [];
    configuration.bricks.forEach((brickConfig, brickIndex) => {
      let cementHelper;
      const brickDependencies = {};
      if (Array.isArray(configuration.tools)) {
        configuration.tools.filter((gTool) => {
          return (gTool.scope === 'all' || gTool.scope === 'bricks');
        }).forEach((gTool) => {
          brickDependencies[gTool.name] = that.tools[gTool.name];
        });
      }
      if (typeof brickConfig.dependencies === 'object' && Object.keys(brickConfig.dependencies).length) {
        Object.keys(brickConfig.dependencies).forEach((dependency) => {
          const reference = brickConfig.dependencies[dependency];
          brickDependencies[dependency] = that.tools[reference];
        });
      }
      try {
        cementHelper = new CementHelper(this, brickConfig.name, brickDependencies);
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

      const fn = BrickInstance.init();
      initialized.push(fn);

      this.bricks.set(brickConfig.name, {
        configuration: brickConfig,
        cementHelper: cementHelper,
        instance: BrickInstance,
      });
    });

    Promise.all(initialized)
      .then((data) => {
        that.logger.debug('Initialized bricks: ', data);
        that.bootstrap();
        that.start();
      })
      .catch((err) => {
        that.logger.error('Can\'t initialize all bricks: ', err);
        throw new Error('Fatal error, can\'t initialize all bricks');
      });
  }

  /**
   * Bootstraps the cement,
   * should be called after all bricks are initialized
   * */
  bootstrap() {
    const that = this;
    that.configuration.bricks.forEach((brickConfig) => {
      if (Array.isArray(brickConfig.publish)) {
        brickConfig.publish.forEach((pubContract) => {
          if (!that.channels.has(pubContract.topic)) {
            that.channels.set(pubContract.topic, new Channel(pubContract.topic));
          }
          that.channels.get(pubContract.topic).addPublisher(brickConfig.name, pubContract.data, that.bricks.get(brickConfig.name).instance);
        });
      }

      if (Array.isArray(brickConfig.subscribe)) {
        brickConfig.subscribe.forEach((subContract) => {
          if (!that.channels.has(subContract.topic)) {
            that.channels.set(subContract.topic, new Channel(subContract.topic));
          }
          that.channels.get(subContract.topic).addSubscriber(brickConfig.name, subContract.data, that.bricks.get(brickConfig.name).instance);
        });
      }
    });
  }

  /**
   * Start bricks, to use cement features
   * Should be called after the cement is bootstrapped
   * */
  start() {
    const that = this;
    that.bricks.forEach((brick) => {
      brick.instance.start();
    });
    that.emit('started');
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
      if (!brickConfig.hasOwnProperty('name') || typeof brickConfig.name !== 'string') {
        throw (new Error(`missing/incorrect 'name' string property in bricks[${brickIndex}]`));
      }

      if (uniqueNames.indexOf(brickConfig.name) !== -1) {
        throw (new Error(`bricks[${brickIndex}] name '${brickConfig.name}' is not unique`));
      }
      uniqueNames.push(brickConfig.name);

      if (!brickConfig.hasOwnProperty('module') || typeof brickConfig.module !== 'string') {
        throw (new Error(`missing/incorrect 'module' string property in bricks[${brickIndex}]`));
      }

      if (brickConfig.hasOwnProperty('properties')) {
        if (typeof brickConfig.properties !== 'object') {
          throw (new Error(`incorrect 'properties' object property in bricks[${brickIndex}]`));
        }
      }

      if (brickConfig.hasOwnProperty('publish')) {
        if (!Array.isArray(brickConfig.publish)) {
          throw (new Error(`incorrect 'publish' Array property in bricks[${brickIndex}]`));
        } else {
          const uniquePubNames = [];
          brickConfig.publish.forEach((pub, pubIndex) => {
            if (!pub.hasOwnProperty('topic') || typeof pub.topic !== 'string') {
              throw (new Error(`missing/incorrect 'topic' string property in bricks[${brickIndex}].publish[${pubIndex}]`));
            }

            if (uniquePubNames.indexOf(pub.topic) !== -1) {
              throw (new Error(`publish contract '${pub.topic}' is declared more than once`));
            }
            uniquePubNames.push(pub.topic);

            if (pub.hasOwnProperty('data')) {
              if (!Array.isArray(pub.data)) {
                throw (new Error(`incorrect 'data' Array property in bricks[${brickIndex}].publish[${pubIndex}]`));
              } else if (pub.data.length === 0) {
                throw (new Error(`empty 'data' Array property in bricks[${brickIndex}].publish[${pubIndex}]`));
              }
            }
          });
        }
      }

      if (brickConfig.hasOwnProperty('subscribe')) {
        if (!Array.isArray(brickConfig.subscribe)) {
          throw (new Error(`incorrect 'subscribe' Array property in bricks[${brickIndex}]`));
        } else {
          const uniqueSubNames = [];
          brickConfig.subscribe.forEach((sub, pubIndex) => {
            if (!sub.hasOwnProperty('topic') || typeof sub.topic !== 'string') {
              throw (new Error(`missing/incorrect 'topic' string property in bricks[${brickIndex}].subscribe[${pubIndex}]`));
            }

            if (uniqueSubNames.indexOf(sub.topic) !== -1) {
              throw (new Error(`subscribe contract '${sub.topic}' is declared more than once`));
            }
            uniqueSubNames.push(sub.topic);

            if (sub.hasOwnProperty('data')) {
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
          filterCondition &= channel.canPublish(name, data);
        }
        return filterCondition;
      });
    return results;
  }

  /**
   * Publish a Context using channels
   * @param {Context} context - the context to publish
   */
  publish(context) {
    const that = this;
    const destinations = that.getDestinations(context.from, context.data);
    if (destinations.length === 0) {
      throw new Error(`no publishing channels found for brick ${context.from}`);
    } else {
      destinations.forEach((channel) => {
        channel.publish(context);
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
