'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');
require('sinon-as-promised');

const CementHelper = require('../../lib/cementhelper');
const Cement = require('../../lib/cement');
const Context = require('../../lib/context');
const SmartEventEmitter = require('../../lib/smarteventemitter');
const authorizedEvents = require('../../lib/contextevents');
const configuration = require('./cement-configuration.json');

const cement = new Cement(configuration);
const cementHelper = new CementHelper(cement, 'mybrick1');

describe('Context - instantiate', function() {
  // describe('validate data (e.g. job properties)', function() {
  //  //context('when missing/incorrect \'id\' string property in data', function() {
  //  //  it('should throw an error', function() {
  //  //    const job = {};
  //  //    return expect(function() {
  //  //      return new Context(cementHelper, job);
  //  //    }).to.throw(Error, 'missing/incorrect \'id\' string property in data');
  //  //  });
  //  //});
  //
  //  context('when missing/incorrect \'nature\' object property in data', function() {
  //    it('should throw an error', function() {
  //      const job = {
  //        id: '001',
  //      };
  //      return expect(function() {
  //        return new Context(cementHelper, job);
  //      }).to.throw(Error, 'missing/incorrect \'nature\' object property in data');
  //    });
  //  });
  //
  //  context('when missing/incorrect \'quality\' string property in data.nature', function() {
  //    it('should throw an error', function() {
  //      const job = {
  //        id: '001',
  //        nature: {
  //          type: 'bar',
  //        },
  //      };
  //      return expect(function() {
  //        return new Context(cementHelper, job);
  //      }).to.throw(Error, 'missing/incorrect \'quality\' string property in data.nature');
  //    });
  //  });
  //
  //  context('when missing/incorrect \'type\' string property in data.nature', function() {
  //    it('should throw an error', function() {
  //      const job = {
  //        id: '001',
  //        nature: {
  //          quality: 'Execution',
  //        },
  //      };
  //      return expect(function() {
  //        return new Context(cementHelper, job);
  //      }).to.throw(Error, 'missing/incorrect \'type\' string property in data.nature');
  //    });
  //  });
  //
  //  context('when missing/incorrect \'payload\' object property in data', function() {
  //    it('should throw an error', function() {
  //      const job = {
  //        id: '001',
  //        nature: {
  //          quality: 'Execution',
  //          type: 'CommandLine',
  //        },
  //      };
  //      return expect(function() {
  //        return new Context(cementHelper, job);
  //      }).to.throw(Error, 'missing/incorrect \'payload\' object property in data');
  //    });
  //  });
  // });

  describe('validate events argument', function() {
    context('when incorrect \'events\' Array argument', function() {
      it('should throw an error', function() {
        return expect(function() {
          return new Context(cementHelper, {}, {});
        }).to.throw(Error, 'incorrect \'events\' Array argument');
      });
    });
  });

  context('when valid', function() {
    before(function() {
      sinon.spy(SmartEventEmitter.prototype, 'setAuthorizedEvents');
    });
    after(function() {
      SmartEventEmitter.prototype.setAuthorizedEvents.restore();
    });
    it('should return a new Context', function(done) {
      const context = new Context(cementHelper, {
        id: '001',
        nature: {
          type: 'Execution',
          quality: 'CommandLine',
        },
        payload: {},
      });
      expect(context).to.be.an.instanceof(Context);
      authorizedEvents.forEach(function(event) {
        expect(context.authorizedEvents.has(event)).to.equal(true);
      });
      done();
    });
  });

  context('when valid with additional events to authorize', function() {
    before(function() {
      sinon.spy(SmartEventEmitter.prototype, 'setAuthorizedEvents');
    });
    after(function() {
      SmartEventEmitter.prototype.setAuthorizedEvents.restore();
    });
    it('should return a new Context', function(done) {
      const additionalEvents = ['someevent'];
      const context = new Context(cementHelper, {
        id: '001',
        nature: {
          type: 'Execution',
          quality: 'CommandLine',
        },
        payload: {},
      }, additionalEvents);
      expect(context).to.be.an.instanceof(Context);
      authorizedEvents.concat(additionalEvents).forEach(function(event) {
        expect(context.authorizedEvents.has(event)).to.equal(true);
      });
      done();
    });
  });
});

describe('Context - publish', function() {
  it('should call CimentHelper publish()', function() {
    const context = new Context(cementHelper, {
      id: '001',
      nature: {
        type: 'execution',
        quality: 'commandline',
      },
      payload: {},
    });
    const spy = sinon.spy(cementHelper, 'publish');
    context.publish();
    return expect(spy.calledOnce).to.be.true;
  });
});
