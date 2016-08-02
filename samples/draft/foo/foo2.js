'use strict';

const Brick = require('cta-brick');

class Foo2 extends Brick {
  constructor(cementHelper, config) {
    super(cementHelper, config);
    this.dependencies.healthCheck.update(this.name, {status: 'green'});
  }

  process(context) {
    if (context.data.nature.type === 'logs' && context.data.nature.quality === 'something') {
      this.logger.info(context.data.payload);
    }
  }
}

module.exports = Foo2;
