'use strict';

const Brick = require('cta-brick');

class Three extends Brick {
  constructor(cementHelper, config) {
    super(cementHelper, config);
  }

  init() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject();
      }, 700);
    });
  }

  validate(job) {
    return Promise.resolve(job);
  }

  process(context) {
    const that = this;
    try {
      // simulate job slowness
      setTimeout(function() {
        that.cementHelper.createContext({}).publish();
        context.emit('done', that.name);
      }, 200);
    } catch (err) {
      context.emit('reject', that.name, err);
      context.emit('error', that.name, err);
    }
  }
}

module.exports = Three;
