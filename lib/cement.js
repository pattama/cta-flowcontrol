/**
 * Created by U6020429 on 12/02/2016.
 */
'use strict';
const CementHelper = require('./cement-helper');

class Cement {
  constructor(configuration) {
    if (!(Array.isArray(configuration.bricks))) {
      throw new TypeError('incorrect bricks Array');
    }

    this.bricks = new Map();
    configuration.bricks.forEach((brickConfig) => {
      const cementHelper = new CementHelper(this, brickConfig.name);
      const BrickConstructor = require(brickConfig.module);
      this.bricks.set(brickConfig.name, {
        configuration: brickConfig,
        cementHelper: cementHelper,
        instance: new BrickConstructor(cementHelper, brickConfig),
      });
    });
  }

  send(context) {
    const source = this.bricks.get(context.from);
    if (source.configuration.links && Array.isArray(source.configuration.links)) {
      source.configuration.links.forEach((link) => {
        const dest = this.bricks.get(link.name);
        console.log(`${source.configuration.name}->${link.name} sent: ${JSON.stringify(context.data)}`);
        dest.instance.onData(context);
      });
    }
  }
}

exports = module.exports = Cement;
