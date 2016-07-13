'use strict';

const Brick = require('cta-brick');

class One extends Brick {
  constructor(cementHelper, config) {
    super(cementHelper, config);
  }

  init() {
    const that = this;
    return new Promise((resolve) => {
      setTimeout(() => {
        that.logger.info(`Initialized Brick ${that.name}.`);
        resolve('ok');
      }, 500);
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

module.exports = One;
