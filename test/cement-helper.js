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

describe('CementHelper - send Context', function() {
  it('should call Cement send()', function() {
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
    const spy = sinon.spy(cement, 'send');
    cementHelper.send(context);
    return expect(spy.calledOnce).to.be.true;
  });
});
