'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');
require('sinon-as-promised');

const SmartEventEmitter = require('../../lib/smarteventemitter');
const EventEmitter = require('events');

describe('SmartEventEmitter - constructor', function() {
  let smartEventEmitter;
  before(function() {
    smartEventEmitter = new SmartEventEmitter();
  });
  context('when everything ok', function() {
    it('should extend EventEmitter', function() {
      expect(Object.getPrototypeOf(SmartEventEmitter)).to.equal(EventEmitter);
    });
    it('should return a SmartEventEmitter object', function() {
      expect(smartEventEmitter).to.be.an.instanceof(SmartEventEmitter);
    });
    it('should have an authorizedEvents Set property', function() {
      expect(smartEventEmitter).to.have.property('authorizedEvents');
      expect(smartEventEmitter.authorizedEvents).to.be.a('Set');
      expect(smartEventEmitter.authorizedEvents.has('error')).to.equal(true);
    });
  });
});

describe('SmartEventEmitter - setAuthorizedEvents', function() {
  let smartEventEmitter;
  const authorizedEvents = ['foo', 'bar'];
  before(function() {
    smartEventEmitter = new SmartEventEmitter();
    smartEventEmitter.setAuthorizedEvents(authorizedEvents);
  });
  context('when everything ok', function() {
    it('should have an authorizedEvents Set property', function() {
      expect(smartEventEmitter.authorizedEvents).to.be.a('Set');
      authorizedEvents.forEach(function(authorizedEvent) {
        expect(smartEventEmitter.authorizedEvents.has(authorizedEvent)).to.equal(true);
      });
    });
  });
});

describe('SmartEventEmitter - methods adding listener', function() {
  let smartEventEmitter;
  const authorizedEvents = ['done'];
  before(function() {
    smartEventEmitter = new SmartEventEmitter();
    smartEventEmitter.setAuthorizedEvents(authorizedEvents);
  });
  ['on', 'once', 'addListener'].forEach(function(methodName) {
    describe(`${methodName}`, function() {
      let result;
      context('when event is authorized', function() {
        before(function() {
          sinon.spy(EventEmitter.prototype, methodName);
          result = smartEventEmitter[methodName]('done', sinon.stub());
        });
        after(function() {
          EventEmitter.prototype[methodName].restore();
        });
        it(`should call parent class (e.g. EventEmitter) '${methodName}' method`, function() {
          expect(EventEmitter.prototype[methodName].called).to.equal(true);
        });
        it('should return the smartEventEmitter (this)', function() {
          expect(result).to.equal(smartEventEmitter);
        });
        context('when event is not authorized', function() {
          it('throw an Error', function() {
            const notAuthorizedEvent = 'not-authorized';
            expect(function() {
              smartEventEmitter[methodName](notAuthorizedEvent, sinon.stub());
            }).to.throw(Error, `Adding listener to event '${notAuthorizedEvent}' is not authorized.`);
          });
        });
      });
    });
  });
});

describe('SmartEventEmitter - emit', function() {
  let smartEventEmitter;
  const authorizedEvents = ['done'];
  before(function() {
    smartEventEmitter = new SmartEventEmitter();
    smartEventEmitter.setAuthorizedEvents(authorizedEvents);
  });
  describe('emit', function() {
    let result;
    context('when event is authorized', function() {
      before(function() {
        sinon.spy(EventEmitter.prototype, 'emit');
        result = smartEventEmitter.emit('done');
      });
      after(function() {
        EventEmitter.prototype.emit.restore();
      });
      it('should call parent class (e.g. EventEmitter) \'emit\' method', function() {
        expect(EventEmitter.prototype.emit.called).to.equal(true);
      });
      it('should return the response from parent class \'emit\' method', function() {
        expect(result).to.equal(EventEmitter.prototype.emit.returnValues[0]);
      });
    });

    context('when event is not authorized', function() {
      it('throw an Error', function() {
        const notAuthorizedEvent = 'not-authorized';
        expect(function() {
          smartEventEmitter.emit(notAuthorizedEvent, sinon.stub());
        }).to.throw(Error, `Emitting event '${notAuthorizedEvent}' is not authorized.`);
      });
    });
  });
});
