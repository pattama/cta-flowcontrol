'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const mockrequire = require('mock-require');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
require('sinon-as-promised');

const Cement = require('../lib/cement');
const CementHelper = require('../lib/cement-helper');
const configuration = require('./cement-configuration.json');

const cement = new Cement(configuration);

describe('Cement - instantiate', function() {
  context('when bricks is not an Array', function() {
    it('should throw an error', function() {
      return expect(function() {
        return new Cement({
          bricks: '',
        });
      }).to.throw(TypeError, 'bricks type is not Array');
    });
  });

  context('when missing/incorrect name string property in a brick', function() {
    it('should throw an error', function() {
      return expect(function() {
        return new Cement({
          bricks: [
            {
              name: {},
            },
          ],
        });
      }).to.throw(Error, `missing/incorrect 'name' string property in bricks[0]`);
    });
  });

  context('when missing/incorrect module string property in a brick', function() {
    it('should throw an error', function() {
      return expect(function() {
        return new Cement({
          bricks: [
            {
              name: 'mybrick1',
              module: {},
            },
          ],
        });
      }).to.throw(Error, `missing/incorrect 'module' string property in bricks[0]`);
    });
  });

  context('when failing to instantiate cementhelper in a brick', function() {
    let StubCement;
    const stubError = new Error('CementHelper stubbed');
    before(function() {
      mockrequire('../lib/cement-helper', function() {
        throw stubError;
      });
      const StubCementHelper = require('../lib/cement-helper');
      StubCement = proxyquire('../lib/cement', {
        CementHelper: StubCementHelper,
      });
    });

    after(function() {
      mockrequire.stop('../lib/cement-helper');
    });

    it('should throw an error', function() {
      return expect(function() {
        return new StubCement({
          bricks: [
            {
              name: 'mybrick1',
              module: 'cta-brick',
            },
          ],
        });
      }).to.throw(Error, `failed to instantiate new cementHelper in bricks[0]: ${stubError}`);
    });
  });

  context('when failing to load module in a brick', function() {
    it('should throw an error', function() {
      return expect(function() {
        return new Cement({
          bricks: [
            {
              name: 'mybrick1',
              module: 'foobar',
            },
          ],
        });
      }).to.throw(Error, /failed to load module 'foobar' in bricks/);
    });
  });

  context('when failing to instantiate module in a brick', function() {
    const stubError = new Error('Brick stubbed');
    before(function() {
      mockrequire('stub-brick', function() {
        throw stubError;
      });
    });

    after(function() {
      mockrequire.stop('stub-brick');
    });

    it('should throw an error', function() {
      return expect(function() {
        return new Cement({
          bricks: [
            {
              name: 'mybrick1',
              module: 'stub-brick',
            },
          ],
        });
      }).to.throw(Error, `failed to instantiate new 'stub-brick' in bricks[0]: ${stubError}`);
    });
  });

  context('when not unique name in brick', function() {
    it('should throw an error', function() {
      return expect(function() {
        return new Cement({
          bricks: [
            {
              name: 'foobar',
              module: 'cta-brick',
              properties: {},
              links: [],
            },
            {
              name: 'foobar',
              module: 'cta-brick',
              properties: {},
              links: [],
            },
          ],
        });
      }).to.throw(Error, `bricks[1] name 'foobar' is not unique`);
    });
  });

  context('when missing/incorrect links Array property in a link', function() {
    it('should throw an error', function() {
      return expect(function() {
        return new Cement({
          bricks: [
            {
              name: 'mybrick1',
              module: 'cta-brick',
              properties: {},
              links: '',
            },
          ],
        });
      }).to.throw(Error, `missing/incorrect 'links' Array property in bricks[0]`);
    });
  });

  context('when not unique link name in brick.links', function() {
    it('should throw an error', function() {
      return expect(function() {
        return new Cement({
          bricks: [
            {
              name: 'mybrick1',
              module: 'cta-brick',
              properties: {},
              links: [
                {
                  name: 'foobar',
                },
                {
                  name: 'foobar',
                },
              ],
            },
          ],
        });
      }).to.throw(Error, `bricks[0].links[1] name 'foobar' is not unique`);
    });
  });

  context('when missing/incorrect name Array property in a brick', function() {
    it('should throw an error', function() {
      return expect(function() {
        return new Cement({
          bricks: [
            {
              name: 'mybrick1',
              module: 'cta-brick',
              properties: {},
              links: '',
            },
          ],
        });
      }).to.throw(Error, `missing/incorrect 'links' Array property in bricks[0]`);
    });
  });

  context('when a brick has an uninstantiated link', function() {
    it('should throw an error', function() {
      return expect(function() {
        return new Cement({
          bricks: [
            {
              name: 'foobar1',
              module: 'cta-brick',
              properties: {},
              links: [
                {
                  'name': 'foobar2',
                },
                {
                  'name': 'foobar3',
                },
              ],
            },
            {
              name: 'foobar2',
              module: 'cta-brick',
              properties: {},
              links: [],
            },
          ],
        });
      }).to.throw(Error, `bricks[0] 'foobar1' has an uninstantiated link links[1] 'foobar3'`);
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
