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

describe('CementHelper - require', function() {
  let cementHelper;
  const mockPath = './mock/path/to/module';
  before(function() {
    cementHelper = new CementHelper(cement, 'mybrick1');
    sinon.stub(cement, 'require').withArgs(mockPath);
  });
  after(function() {
    cement.require.restore();
  });
  it('should return cement.require result', function() {
    expect(cementHelper.require(mockPath)).to.equal(cement.require.returnValues[0]);
  });
});

describe('CementHelper - create Context', function() {
  context('without additional events', function() {
    it('should return a Context', function(done) {
      const cementHelper = new CementHelper(cement, 'mybrick1');
      const data = {
        id: '001',
        nature: {
          quality: 'execution',
          type: 'commandline',
        },
        payload: {},
      };
      const context = cementHelper.createContext(data);
      expect(context).to.be.an.instanceof(Context);
      expect(context).to.have.property('cementHelper').and.to.be.deep.equal(cementHelper);
      expect(context).to.have.property('from').and.to.be.deep.equal(cementHelper.brickName);
      expect(context).to.have.property('data').and.to.be.deep.equal(data);
      expect(context).to.have.property('authorizedEvents').and.to.be.a('Set');
      done();
    });
  });

  context('with additional events', function() {
    it('should return a Context', function(done) {
      const cementHelper = new CementHelper(cement, 'mybrick1');
      const data = {
        id: '001',
        nature: {
          quality: 'execution',
          type: 'commandline',
        },
        payload: {},
      };
      const events = [ 'foo', 'bar' ];
      const context = cementHelper.createContext(data, events);
      expect(context).to.be.an.instanceof(Context);
      expect(context).to.have.property('cementHelper').and.to.be.deep.equal(cementHelper);
      expect(context).to.have.property('from').and.to.be.deep.equal(cementHelper.brickName);
      expect(context).to.have.property('data').and.to.be.deep.equal(data);
      expect(context).to.have.property('authorizedEvents').and.to.be.a('Set');
      events.forEach(function(event) {
        expect(context.authorizedEvents.has(event)).to.equal(true);
      });
      done();
    });
  });
});

describe('CementHelper - publish Context', function() {
  it('should call Cement publish()', function() {
    const cementHelper = new CementHelper(cement, 'mybrick1');
    const data = {
      id: '001',
      nature: {
        type: 'execution',
        quality: 'commandline',
      },
      payload: {},
    };
    const context = cementHelper.createContext(data);
    const spy = sinon.spy(cement, 'publish');
    cementHelper.publish(context);
    return expect(spy.calledOnce).to.be.true;
  });
});

describe('CementHelper - dependencies', function() {
  it('should have dependencies as property', function(done) {
    try {
      const dependencies = {
        one: {},
        two: {},
      };
      const cementHelper = new CementHelper(cement, 'mybrick1', dependencies);
      expect(cementHelper).to.have.property('dependencies');
      done();
    } catch (e) {
      done(e);
    }
  });
});

/*
describe('CementHelper - health', function() {
  it('should pull up health to cement', function(done) {
    const cementHelper = new CementHelper(cement, 'mybrick1');
    const health = sinon.spy(cement, 'health');
    cementHelper.health({});
    sinon.assert.calledWith(health, 'mybrick1', {});
    done();
  });
});
*/
