/**
 * Created by U6020429 on 12/02/2016.
 */
'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

const CementHelper = require('../lib/cementHelper');
const Cement = require('../lib/cement');
const configuration = require('./cementConfiguration.json');

describe('CementHelper instantiation', function() {
  context('when incorrect brickName', function() {
    it('should throw an error', function() {
      const cement = new Cement(configuration);
      return expect(function() {
        return new CementHelper(cement, {});
      }).to.throw(TypeError, 'incorrect brickName');
    });
  });
});
