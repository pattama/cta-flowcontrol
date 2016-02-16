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
const Context = require('../lib/context');
const configuration = require('./cementConfiguration.json');

const cement = new Cement(configuration);
const cementHelper = new CementHelper(cement, 'mybrick1');

describe('Context instantiation', function() {
  context('when valid', function() {
    it('should return a new Context', function(done) {
      const context = new Context(cementHelper, {});
      expect(context).to.be.an.instanceof(Context);
      done();
    });
  });
});
