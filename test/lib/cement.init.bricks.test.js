'use strict';

const sinon = require('sinon');
const Cement = require('../../lib/cement');

describe('Cement - init', () => {
  it('should init all bricks', (done) => {
    const config = require('./cement.init.bricks.testdata/config12');
    const cement = new Cement(config);
    const start = sinon.spy(cement, 'start');
    const eventStartedEmitted = sinon.spy(cement, 'emit').withArgs('started');
    setTimeout(() => {
      sinon.assert.calledOnce(start);
      sinon.assert.calledOnce(eventStartedEmitted);
      done();
    }, 1000);
  });

  it('should throw init error', (done) => {
    const config = require('./cement.init.bricks.testdata/config123');
    const cement = new Cement(config);
    const start = sinon.spy(cement, 'start');
    setTimeout(() => {
      sinon.assert.notCalled(start);
      done();
    }, 1000);
  });
});
