/**
 * Created by U6020429 on 12/02/2016.
 */
'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');
require('sinon-as-promised');

const Cement = require('../lib/cement');
const CementHelper = require('../lib/cementHelper');
const configuration = require('./cementConfiguration.json');

const cement = new Cement(configuration);

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
      expect(cement).to.be.an.instanceof(Cement);
      expect(cement).to.have.property('bricks').and.to.be.a('Map');
      configuration.bricks.forEach(function(brick) {
        expect(cement.bricks.has(brick.name)).to.be.equal(true);
        expect(cement.bricks.get(brick.name)).to.have.property('configuration');
        expect(cement.bricks.get(brick.name).configuration).to.be.deep.equal(brick);
        expect(cement.bricks.get(brick.name)).to.have.property('cementHelper').and.to.be.an.instanceof(CementHelper);
        expect(cement.bricks.get(brick.name)).to.have.property('instance').and.to.be.an.instanceof(require(brick.module));
      });
      done();
    });
  });

  describe('Cement - send Context', function() {
    const brick = cement.bricks.get('mybrick1');
    const spyCementHelper = sinon.spy(brick.cementHelper, 'send');
    const spyCement = sinon.spy(cement, 'send');
    const spyLinks = [];
    if (brick.configuration.links && Array.isArray(brick.configuration.links)) {
      brick.configuration.links.forEach(function(link) {
        spyLinks.push(sinon.spy(cement.bricks.get(link.name).instance, 'onData'));
      });
    }

    before(function(done) {
      brick.cementHelper.createContext({'payload': 'start 1'}).send();
      setInterval(done, 2000);
    });

    it('should call send() and all linked Bricks onData()', function(done) {
      expect(spyCementHelper.calledOnce).to.be.equal(true);
      expect(spyCement.calledOnce).to.be.equal(true);
      spyLinks.forEach(function(spyLink) {
        expect(spyLink.calledOnce).to.be.equal(true);
      });
      done();
    });

    after(function(done) {
      brick.cementHelper.send.restore();
      cement.send.restore();
      if (brick.configuration.links && Array.isArray(brick.configuration.links)) {
        brick.configuration.links.forEach(function(link) {
          cement.bricks.get(link.name).instance.onData.restore();
        });
      }
      done();
    });
  });
});
