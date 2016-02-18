/**
 * Created by U6020429 on 12/02/2016.
 */
'use strict';
const CementHelper = require('./cement-helper');

class Cement {
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
          throw (new Error(`missing/incorrect 'links' Array property in bricks[${brickIndex}]`));
        } else {
          brickConfig.links.forEach((link, linkIndex) => {
            if (!('name' in brickConfig) || typeof brickConfig.name !== 'string') {
              throw (new Error(`missing/incorrect 'name' string property in bricks[${brickIndex}].links[${linkIndex}]`));
            }
          });
        }
      }
    });
  }

  send(context) {
    const source = this.bricks.get(context.from);
    if ('links' in source.configuration && Array.isArray(source.configuration.links)) {
      source.configuration.links.forEach((link) => {
        const dest = this.bricks.get(link.name);
        console.log(`${source.configuration.name}->${link.name} sent: ${JSON.stringify(context.data)}`);
        dest.instance.onData(context);
      });
    }
  }
}

exports = module.exports = Cement;
