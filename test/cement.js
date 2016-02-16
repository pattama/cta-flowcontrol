/**
 * Created by U6020429 on 12/02/2016.
 */
'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

const Cement = require('../lib/cement');
const CementHelper = require('../lib/cementHelper');
const configuration = require('./cementConfiguration.json');
const sinon = require('sinon');
require('sinon-as-promised');

describe('Cement - instantiate', function() {
  context('when incorrect bricks Array', function() {
    it('should throw an error', function() {
      return expect(function() {
        return new Cement({
          bricks: '',
        });
      }).to.throw(TypeError, 'incorrect bricks Array');
    });
  });

  context('when valid', function() {
    it('should return a new Cement', function(done) {
      const cement = new Cement(configuration);
      expect(cement).to.be.an.instanceof(Cement);
      expect(cement).to.have.property('bricks').and.to.be.a('Map');
      expect(cement).to.have.property('Modules').and.to.be.a('Map');
      configuration.bricks.forEach(function(brick) {
        expect(cement.Modules.has(brick.module)).to.be.equal(true);
        expect(cement.bricks.has(brick.name)).to.be.equal(true);
        expect(cement.bricks.get(brick.name)).to.have.property('configuration');
        expect(cement.bricks.get(brick.name).configuration).to.be.deep.equal(brick);
        expect(cement.bricks.get(brick.name)).to.have.property('cementHelper').and.to.be.an.instanceof(CementHelper);
        expect(cement.bricks.get(brick.name)).to.have.property('instance').and.to.be.an.instanceof(cement.Modules.get(brick.module));
      });
      done();
    });
  });

  describe('Cement - send Context', function() {
    it('should call send Context to linked Bricks', function(done) {
      const cement = new Cement(configuration);
      const brick = cement.bricks.get('mybrick1');
      brick.cementHelper.createContext({'payload': 'start 1'}).send();
      const spy = sinon.spy(cement, 'send');
      //expect(spy.called).to.be.equal(true);
      done();
    });
  });
});
