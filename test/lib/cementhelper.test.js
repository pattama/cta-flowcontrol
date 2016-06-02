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
const configuration = require('./cement-configuration.json');

const cement = new Cement(configuration);

describe('CementHelper - instantiate', function() {
  context('when incorrect brickName', function() {
    it('should throw an error', function() {
      return expect(function() {
        return new CementHelper(cement, {});
      }).to.throw(TypeError, 'incorrect brickName');
    });
  });
});

describe('CementHelper - create Context', function() {
  it('should return a Context', function(done) {
    const cementHelper = new CementHelper(cement, 'mybrick1');
    const data = {
      id: '001',
      nature: {
        quality: 'Execution',
        type: 'CommandLine',
      },
      payload: {},
    };
    const context = cementHelper.createContext(data);
    expect(context).to.be.an.instanceof(Context);
    expect(context).to.have.property('cementHelper').and.to.be.deep.equal(cementHelper);
    expect(context).to.have.property('from').and.to.be.deep.equal(cementHelper.brickName);
    expect(context).to.have.property('data').and.to.be.deep.equal(data);
    done();
  });
});

describe('CementHelper - publish Context', function() {
  it('should call Cement publish()', function() {
    const cementHelper = new CementHelper(cement, 'mybrick1');
    const data = {
      id: '001',
      nature: {
        type: 'Execution',
        quality: 'CommandLine',
      },
      payload: {},
    };
    const context = cementHelper.createContext(data);
    const spy = sinon.spy(cement, 'publish');
    cementHelper.publish(context);
    return expect(spy.calledOnce).to.be.true;
  });
});

describe('CementHelper - logger', function() {
  it('should have logger instance as property', function(done) {
    try {
      const logger = {
        info: function() {
          return;
        },
      };
      const cementHelper = new CementHelper(cement, 'mybrick1', logger);
      expect(cementHelper).to.have.property('logger');
      cementHelper.logger.info('Hi there!');
      done();
    } catch (e) {
      done(e);
    }
  });
});
