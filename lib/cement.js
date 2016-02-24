'use strict';
const CementHelper = require('./cement-helper');

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
    });

    // Verifying all Links are instantiated
    configuration.bricks.forEach((brickConfig, brickIndex) => {
      if ('links' in brickConfig) {
        brickConfig.links.forEach((link, linkIndex) => {
          if (!this.bricks.has(link.name)) {
            throw new Error(`bricks[${brickIndex}] '${brickConfig.name}' has an uninstantiated link`
              + ` links[${linkIndex}] '${link.name}'`);
          }
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

      if ('links' in brickConfig) {
        if (!Array.isArray(brickConfig.links)) {
          throw (new Error(`incorrect 'links' Array property in bricks[${brickIndex}]`));
        } else {
          const uniqueLinks = [];
          brickConfig.links.forEach((link, linkIndex) => {
            if (!('name' in link) || typeof link.name !== 'string') {
              throw (new Error(`missing/incorrect 'name' string property in bricks[${brickIndex}].links[${linkIndex}]`));
            }

            if (uniqueLinks.indexOf(link.name) !== -1) {
              throw (new Error(`bricks[${brickIndex}].links[${linkIndex}] name '${link.name}' is not unique`));
            }
            uniqueLinks.push(link.name);

            if ('jobs' in link) {
              if (!Array.isArray(link.jobs)) {
                throw (new Error(`incorrect 'jobs' Array property in bricks[${brickIndex}].links[${linkIndex}]`));
              } else {
                link.jobs.forEach((job, jobIndex) => {
                  if ('type' in job && typeof job.type !== 'string') {
                    throw (new Error(`missing/incorrect 'type' string property in bricks[${brickIndex}].links[${linkIndex}].jobs[${jobIndex}]`));
                  }

                  if ('quality' in job && typeof job.quality !== 'string') {
                    throw (new Error(`missing/incorrect 'quality' string property in bricks[${brickIndex}].links[${linkIndex}].jobs[${jobIndex}]`));
                  }
                });
              }
            }
          });
        }
      }

      if ('properties' in brickConfig) {
        if (typeof brickConfig.properties !== 'object') {
          throw (new Error(`incorrect 'properties' object property in bricks[${brickIndex}]`));
        }
      }
    });
  }

  /**
   * Checks whether the context can be sent to the destination brick
   * @param {Context} context - the context to send
   * @param {String} destination - the name of the destination Brick
   * @returns {Boolean}
   */
  canSend(context, destination) {
    let canSend = false;
    const source = this.bricks.get(context.from);
    if ('links' in source.configuration) {
      const link = source.configuration.links.find((element) => (element.name === destination));
      if (typeof link !== 'undefined') {
        canSend = this.canSendJobToLink(context.data, link);
      }
    }
    return canSend;
  }

  canSendJobToLink(job, link) {
    if (!link.jobs) {
      return true;
    }
    return link.jobs.some((jobdefinition) => {
      let matched = true;
      matched &= jobdefinition.quality === undefined || jobdefinition.quality === job.nature.quality;
      matched &= jobdefinition.type === undefined || jobdefinition.type === job.nature.type;
      if (jobdefinition.except && jobdefinition.except === true) {
        return !matched;
      }
      return matched;
    });
  }

  /**
   * Send a Context to all the links of the Brick which created it
   * @param {Context} context - the context to send
   */
  send(context) {
    const self = this;
    const source = this.bricks.get(context.from);
    if ('links' in source.configuration) {
      source.configuration.links.forEach((link) => {
        if (self.canSend(context, link.name)) {
          const dest = this.bricks.get(link.name);
          console.log(`${source.configuration.name}->${link.name} sent: ${JSON.stringify(context.data)}`);
          dest.instance.onData(context);
        }
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
 * @property {String} type - RegExp Pattern for the type of the Job
 * @property {String} quality - RegExp Pattern for the quality of the Job
 */

/**
 * @typedef {Object} CementConfig
 * @property {BrickConfig[]} bricks - array of brick configurations
 */

/**
 * @typedef {Object} BrickConfig
 * @property {String} name - name of the brick instance (should be unique)
 * @property {String} module - path or name of the brick module
 * @property {Object} properties - properties to instantiate the brick (see the module definition)
 * @property {LinkConfig[]} [links] - Array of LinkConfig
 */

/**
 * @typedef {Object} LinkConfig
 * @property {String} name - name of the brick instance to link (a BrickConfig defining it should exist)
 * @property {JobDefinition[]} jobs - array of definitions of Jobs (e.g. nature) permitted or denied to be sent
 */
