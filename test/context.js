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
  describe('validate data (e.g. job properties)', function() {
    //context('when missing/incorrect \'id\' string property in data', function() {
    //  it('should throw an error', function() {
    //    const job = {};
    //    return expect(function() {
    //      return new Context(cementHelper, job);
    //    }).to.throw(Error, 'missing/incorrect \'id\' string property in data');
    //  });
    //});

    context('when missing/incorrect \'nature\' object property in data', function() {
      it('should throw an error', function() {
        const job = {
          id: '001',
        };
        return expect(function() {
          return new Context(cementHelper, job);
        }).to.throw(Error, 'missing/incorrect \'nature\' object property in data');
      });
    });

    context('when missing/incorrect \'quality\' string property in data.nature', function() {
      it('should throw an error', function() {
        const job = {
          id: '001',
          nature: {
            type: 'bar',
          },
        };
        return expect(function() {
          return new Context(cementHelper, job);
        }).to.throw(Error, 'missing/incorrect \'quality\' string property in data.nature');
      });
    });

    context('when missing/incorrect \'type\' string property in data.nature', function() {
      it('should throw an error', function() {
        const job = {
          id: '001',
          nature: {
            quality: 'Execution',
          },
        };
        return expect(function() {
          return new Context(cementHelper, job);
        }).to.throw(Error, 'missing/incorrect \'type\' string property in data.nature');
      });
    });

    context('when missing/incorrect \'payload\' object property in data', function() {
      it('should throw an error', function() {
        const job = {
          id: '001',
          nature: {
            quality: 'Execution',
            type: 'CommandLine',
          },
        };
        return expect(function() {
          return new Context(cementHelper, job);
        }).to.throw(Error, 'missing/incorrect \'payload\' object property in data');
      });
    });
  });

  context('when valid', function() {
    it('should return a new Context', function(done) {
      const context = new Context(cementHelper, {
        id: '001',
        nature: {
          quality: 'Execution',
          type: 'CommandLine',
        },
        payload: {},
      });
      expect(context).to.be.an.instanceof(Context);
      done();
    });
  });
});

describe('Context - send', function() {
  it('should call CimentHelper send()', function() {
    const context = new Context(cementHelper, {
      id: '001',
      nature: {
        quality: 'Execution',
        type: 'CommandLine',
      },
      payload: {},
    });
    const spy = sinon.spy(cementHelper, 'send');
    context.send();
    return expect(spy.calledOnce).to.be.true;
  });
});
