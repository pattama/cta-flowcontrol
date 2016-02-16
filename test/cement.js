/**
 * Created by U6020429 on 12/02/2016.
 */
'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

const brickTypes = {
  Brick: require('../lib/brick'),
};
const Cement = require('../lib/cement');
const CementHelper = require('../lib/cementHelper');
const configuration = require('./cementConfiguration.json');

describe('Cement instantiation', function() {
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

      configuration.bricks.forEach(function(brick) {
        expect(cement.bricks.has(brick.name)).to.be.equal(true);
        expect(cement.bricks.get(brick.name)).to.have.property('configuration');
        expect(cement.bricks.get(brick.name).configuration).to.be.deep.equal(brick);
        expect(cement.bricks.get(brick.name)).to.have.property('cementHelper').and.to.be.an.instanceof(CementHelper);
        expect(cement.bricks.get(brick.name)).to.have.property('instance').and.to.be.an.instanceof(brickTypes[brick.module]);
      });

      done();
    });
  });
});
