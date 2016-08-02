'use strict';

const Brick = require('cta-brick');

class Foo1 extends Brick {
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
          date: new Date().toISOString(),
        },
      }).publish();
    }
    setInterval(fn, 3000);
  }
}

module.exports = Foo1;
