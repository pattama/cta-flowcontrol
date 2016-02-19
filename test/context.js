'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');
require('sinon-as-promised');

const CementHelper = require('../lib/cement-helper');
const Cement = require('../lib/cement');
const Context = require('../lib/context');
const configuration = require('./cement-configuration.json');

const cement = new Cement(configuration);
const cementHelper = new CementHelper(cement, 'mybrick1');

describe('Context - instantiate', function() {
  context('when valid', function() {
    it('should return a new Context', function(done) {
      const context = new Context(cementHelper, {});
      expect(context).to.be.an.instanceof(Context);
      done();
    });
  });
});

describe('Context - send', function() {
  it('should call CimentHelper send()', function() {
    const context = new Context(cementHelper, {});
    const spy = sinon.spy(cementHelper, 'send');
    context.send();
    return expect(spy.calledOnce).to.be.true;
  });
});
