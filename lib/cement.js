/**
 * Created by U6020429 on 12/02/2016.
 */
'use strict';
const CementHelper = require('./cementHelper');

class Cement {
  constructor(configuration) {
    if (!(Array.isArray(configuration.bricks))) {
      throw new TypeError('incorrect bricks Array');
    }

    this.bricks = new Map();
    configuration.bricks.forEach((brick) => {
      const cementHelper = new CementHelper(this, brick.name);
      const Module = require(brick.module);
      this.bricks.set(brick.name, {
        configuration: brick,
        cementHelper: cementHelper,
        instance: new Module(cementHelper, brick.properties),
      });
    });
  }

  send(context) {
    const source = this.bricks.get(context.from);
    if (source.configuration.links && Array.isArray(source.configuration.links)) {
      source.configuration.links.forEach((link) => {
        const dest = this.bricks.get(link.name);
        console.log('sending to ' + link.name);
        dest.instance.onData(context);
      });
    }
  }
}

exports = module.exports = Cement;
