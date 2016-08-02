'use strict';

const Brick = require('cta-brick');

class Bar1 extends Brick {
  constructor(cementHelper, config) {
    super(cementHelper, config);
    this.dependencies.healthCheck.update(this.name, {status: 'green'});
  }

  start() {
    const that = this;
    function fn() {
      that.cementHelper.createContext({
        nature: {
          type: 'logs',
          quality: 'something',
        },
        payload: {
          number: Math.random(),
        },
      }).publish();
    }
    setInterval(fn, 2000);
  }
}

module.exports = Bar1;
