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
  describe('validating core fields', function() {
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

    context('when incorrect properties object property in a brick', function() {
      it('should throw an error', function() {
        return expect(function() {
          return new Cement({
            bricks: [
              {
                name: 'mybrick1',
                module: 'cta-brick',
                properties: '',
                links: [],
              },
            ],
          });
        }).to.throw(Error, `incorrect 'properties' object property in bricks[0]`);
      });
    });
  });

  describe('validating publish contracts', function() {
    context('when incorrect publish Array property in a brick', function() {
      it('should throw an error', function() {
        return expect(function() {
          return new Cement({
            bricks: [
              {
                name: 'mybrick1',
                module: 'cta-brick',
                properties: {},
                publish: '',
              },
            ],
          });
        }).to.throw(Error, `incorrect 'publish' Array property in bricks[0]`);
      });
    });

    context('when missing/incorrect topic String property in a publish', function() {
      it('should throw an error', function() {
        return expect(function() {
          return new Cement({
            bricks: [
              {
                name: 'mybrick1',
                module: 'cta-brick',
                properties: {},
                publish: [
                  {
                    topic: {},
                  },
                ],
              },
            ],
          });
        }).to.throw(Error, `missing/incorrect 'topic' string property in bricks[0].publish[0]`);
      });
    });

    context('when incorrect data Array property in a publish', function() {
      it('should throw an error', function() {
        return expect(function() {
          return new Cement({
            bricks: [
              {
                name: 'mybrick1',
                module: 'cta-brick',
                properties: {},
                publish: [
                  {
                    topic: 'channel1',
                    data: '',
                  },
                ],
              },
            ],
          });
        }).to.throw(Error, `incorrect 'data' Array property in bricks[0].publish[0]`);
      });
    });

    context('when empty data Array property in a publish', function() {
      it('should throw an error', function() {
        return expect(function() {
          return new Cement({
            bricks: [
              {
                name: 'mybrick1',
                module: 'cta-brick',
                properties: {},
                publish: [
                  {
                    topic: 'channel1',
                    data: [],
                  },
                ],
              },
            ],
          });
        }).to.throw(Error, `empty 'data' Array property in bricks[0].publish[0]`);
      });
    });

    context('when topic is described more than once in publish contracts', function() {
      it('should throw an error', function() {
        return expect(function() {
          return new Cement({
            bricks: [
              {
                name: 'mybrick1',
                module: 'cta-brick',
                properties: {},
                publish: [
                  {
                    topic: 'some.topic',
                    data: [{}],
                  },
                  {
                    topic: 'some.topic',
                    data: [{}],
                  },
                ],
              },
            ],
          });
        }).to.throw(Error, `publish contract 'some.topic' is declared more than once`);
      });
    });
  });

  describe('validating subscribe contracts', function() {
    context('when incorrect subscribe Array property in a brick', function() {
      it('should throw an error', function() {
        return expect(function() {
          return new Cement({
            bricks: [
              {
                name: 'mybrick1',
                module: 'cta-brick',
                properties: {},
                subscribe: '',
              },
            ],
          });
        }).to.throw(Error, `incorrect 'subscribe' Array property in bricks[0]`);
      });
    });

    context('when missing/incorrect topic String property in a subscribe', function() {
      it('should throw an error', function() {
        return expect(function() {
          return new Cement({
            bricks: [
              {
                name: 'mybrick1',
                module: 'cta-brick',
                properties: {},
                subscribe: [
                  {
                    topic: {},
                  },
                ],
              },
            ],
          });
        }).to.throw(Error, `missing/incorrect 'topic' string property in bricks[0].subscribe[0]`);
      });
    });

    context('when incorrect data Array property in a subscribe', function() {
      it('should throw an error', function() {
        return expect(function() {
          return new Cement({
            bricks: [
              {
                name: 'mybrick1',
                module: 'cta-brick',
                properties: {},
                subscribe: [
                  {
                    topic: 'channel1',
                    data: '',
                  },
                ],
              },
            ],
          });
        }).to.throw(Error, `incorrect 'data' Array property in bricks[0].subscribe[0]`);
      });
    });

    context('when empty data Array property in a subscribe', function() {
      it('should throw an error', function() {
        return expect(function() {
          return new Cement({
            bricks: [
              {
                name: 'mybrick1',
                module: 'cta-brick',
                properties: {},
                subscribe: [
                  {
                    topic: 'channel1',
                    data: [],
                  },
                ],
              },
            ],
          });
        }).to.throw(Error, `empty 'data' Array property in bricks[0].subscribe[0]`);
      });
    });

    context('when topic is described more than once in subscribe contracts', function() {
      it('should throw an error', function() {
        return expect(function() {
          return new Cement({
            bricks: [
              {
                name: 'mybrick1',
                module: 'cta-brick',
                properties: {},
                subscribe: [
                  {
                    topic: 'some.topic',
                    data: [{}],
                  },
                  {
                    topic: 'some.topic',
                    data: [{}],
                  },
                ],
              },
            ],
          });
        }).to.throw(Error, `subscribe contract 'some.topic' is declared more than once`);
      });
    });
  });

  describe('loading Bricks', function() {
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
  });

  context('when valid', function() {
    it('should return a new Cement', function(done) {
      expect(cement).to.be.an.instanceof(Cement);
      expect(cement).to.have.property('bricks').and.to.be.a('Map');
      expect(cement).to.have.property('channels').and.to.be.a('Map');
      // TODO improve this
      function test() {
        configuration.bricks.forEach(function(brick) {
          expect(cement.bricks.has(brick.name)).to.be.equal(true);
          expect(cement.bricks.get(brick.name)).to.have.property('configuration');
          expect(cement.bricks.get(brick.name).configuration).to.be.deep.equal(brick);
          expect(cement.bricks.get(brick.name)).to.have.property('cementHelper').and.to.be.an.instanceof(CementHelper);
          expect(cement.bricks.get(brick.name)).to.have.property('instance').and.to.be.an.instanceof(require(brick.module));
          if (Array.isArray(brick.publish)) {
            brick.publish.forEach(function(pubContract) {
              expect(cement.channels.has(pubContract.topic)).to.be.equal(true, 'cement.channels.has(pubContract.topic)');
              const channel = cement.channels.get(pubContract.topic);
              expect(channel.publishers.has(brick.name)).to.be.equal(true);
              expect(channel.publishers.get(brick.name)).to.have.property('data').and.to.deep.equal(pubContract.data);
              expect(channel.publishers.get(brick.name)).to.have.property('brick').and.to.be.an.instanceof(require(brick.module));
            });
          }
          if (Array.isArray(brick.subscribe)) {
            brick.subscribe.forEach(function(subContract) {
              expect(cement.channels.has(subContract.topic)).to.be.equal(true);
              const channel = cement.channels.get(subContract.topic);
              expect(channel.subscribers.has(brick.name)).to.be.equal(true);
              expect(channel.subscribers.get(brick.name)).to.have.property('data').and.to.deep.equal(subContract.data);
              expect(channel.subscribers.get(brick.name)).to.have.property('brick').and.to.be.an.instanceof(require(brick.module));
            });
          }
        });
        done();
      }
      if (cement.bootstrapped) {
        test();
      } else {
        cement.on('bootstrapped', function() {
          test();
        });
      }
    });
  });
});

//describe('Cement - access control list', function() {
//  const brickOne = cement.bricks.get('mybrick1');
//  const brickTwo = cement.bricks.get('mybrick2');
//
//  context('when job is permitted (case #1 - strict quality, strict type)', function() {
//    it('should return true', function() {
//      const context = brickOne.cementHelper.createContext({
//        id: '001',
//        nature: {
//          quality: 'Execution',
//          type: 'CommandLine',
//        },
//        payload: {},
//      });
//      const canSend = cement.canSend(context, 'mybrick2');
//      expect(canSend).to.be.equal(true);
//    });
//  });
//
//  context('when job is permitted (case #2 - strict quality, whatever type)', function() {
//    it('should return true', function() {
//      const context = brickOne.cementHelper.createContext({
//        id: '001',
//        nature: {
//          quality: 'TestStatus',
//          type: 'foo',
//        },
//        payload: {},
//      });
//      const canSend = cement.canSend(context, 'mybrick2');
//      expect(canSend).to.be.equal(true);
//    });
//  });
//
//  context('when job is permitted (case #3 - all except one quality)', function() {
//    it('should return true', function() {
//      const context = brickTwo.cementHelper.createContext({
//        id: '001',
//        nature: {
//          quality: 'foo',
//          type: 'bar',
//        },
//        payload: {},
//      });
//      const canSend = cement.canSend(context, 'mybrick3');
//      expect(canSend).to.be.equal(true);
//    });
//  });
//
//  context('when job is permitted (case #4 - all (undefined jobs Array))', function() {
//    it('should return true', function() {
//      const context = brickTwo.cementHelper.createContext({
//        id: '001',
//        nature: {
//          quality: 'foo',
//          type: 'bar',
//        },
//        payload: {},
//      });
//      const canSend = cement.canSend(context, 'mybrick4');
//      expect(canSend).to.be.equal(true);
//    });
//  });
//
//  context('when job is permitted (case #5 - all (empty jobs Array))', function() {
//    it('should return true', function() {
//      const context = brickTwo.cementHelper.createContext({
//        id: '001',
//        nature: {
//          quality: 'foo',
//          type: 'bar',
//        },
//        payload: {},
//      });
//      const canSend = cement.canSend(context, 'mybrick5');
//      expect(canSend).to.be.equal(true);
//    });
//  });
//
//  context('when job is denied (case #1 - link not defined)', function() {
//    it('should return true', function() {
//      const context = brickOne.cementHelper.createContext({
//        id: '001',
//        nature: {
//          quality: 'Execution',
//          type: 'CommandLine',
//        },
//        payload: {},
//      });
//      const canSend = cement.canSend(context, 'mybrick3');
//      expect(canSend).to.be.equal(false);
//    });
//  });
//
//  context('when job is denied (case #2 - strict quality, strict type)', function() {
//    it('should return false', function() {
//      const context = brickOne.cementHelper.createContext({
//        id: '001',
//        nature: {
//          quality: 'Result',
//          type: 'CommandLine',
//        },
//        payload: {},
//      });
//      const canSend = cement.canSend(context, 'mybrick2');
//      expect(canSend).to.be.equal(false);
//    });
//  });
//
//  context('when job is denied (case #3 - all except one quality)', function() {
//    it('should return false', function() {
//      const context = brickTwo.cementHelper.createContext({
//        id: '001',
//        nature: {
//          quality: 'Execution',
//          type: 'foo',
//        },
//        payload: {},
//      });
//      const canSend = cement.canSend(context, 'mybrick3');
//      expect(canSend).to.be.equal(false);
//    });
//  });
//});

describe('Cement - get publishing channels (e.g. destinations) of a brick', function() {
  const brick = cement.bricks.get('mybrick1');

  describe('arguments validation', function() {
    context('when missing/incorrect \'name\' string property', function() {
      it('should throw an error', function() {
        return expect(function() {
          cement.getDestinations();
        }).to.throw(Error, 'missing/incorrect \'name\' string property');
      });
    });
  });

  describe('get all', function() {
    it('should return an array of channels', function() {
      const channels = cement.getDestinations('mybrick1');
      expect(channels).to.be.an('Array');
      channels.forEach((channel) => {
        const brickHasPubTopic = brick.configuration.publish.some((pub) => {
          return pub.topic === channel.topic;
        });
        expect(brickHasPubTopic).to.equal(true);
      });
    });
  });

  describe('get those matching data contract', function() {
    it('should return an array of channels', function() {
      const data = {
        nature: {
          type: 'Execution',
        },
        payload: {
          foo: 'bar',
        },
      };
      const channels = cement.getDestinations('mybrick1', data);
      expect(channels).to.be.an('Array');
      channels.forEach((channel) => {
        const brickHasPubTopic = brick.configuration.publish.some((pub) => {
          return pub.topic === channel.topic;
        });
        expect(brickHasPubTopic).to.equal(true);
        expect(channel.canPublish('mybrick1', data)).to.equal(true);
      });
    });
  });
});

//describe('Cement - publish Context (no channels matching)', function() {
//  const brick = cement.bricks.get('mybrick1');
//  const context = brick.cementHelper.createContext({
//    id: '001',
//    nature: {
//      type: 'Execution',
//      quality: 'CommandLine',
//    },
//    payload: {},
//  });
//  sinon.stub(cement, 'getDestinations', () => {
//    return [];
//  });
//
//  it('should retrieve destinations', function() {
//    return expect(function() {
//      return context.publish();
//    }).to.throw(Error, `no publishing channels found for brick ${brick.configuration.name}`);
//  });
//
//  after(function(done) {
//    cement.getDestinations.restore();
//    done();
//  });
//});

describe('Cement - publish Context', function() {
  const brick = cement.bricks.get('mybrick1');
  const context = brick.cementHelper.createContext({
    id: '001',
    nature: {
      type: 'Execution',
      quality: 'CommandLine',
    },
    payload: {
      hello: 'world',
    },
  }).on('accept', function onContextAccept(who) {
    console.log(`${brick.configuration.name}: ${who} accepted`);
  })
  .on('reject', function onContextReject(who, reject) {
    console.log(`${brick.configuration.name}: ${who} rejected with ${reject}`);
  })
  .on('done', function onContextReject(who) {
    console.log(`${brick.configuration.name}: ${who} done`);
  })
  .on('error', function onContextReject(who, error) {
    console.log(`${brick.configuration.name}: ${who} done with error ${error}`);
  });
  const destinations = cement.getDestinations(context.from, context.data);
  const spyChannels = [];
  destinations.forEach((channel) => {
    spyChannels.push(sinon.spy(channel, 'publish'));
  });
  const spyCementHelper = sinon.spy(brick.cementHelper, 'publish');
  const spyCementPublish = sinon.spy(cement, 'publish');
  const spyCementDestinations = sinon.spy(cement, 'getDestinations');

  before(function(done) {
    context.publish();
    setInterval(done, 2000);
  });

  it('should retrieve destinations', function(done) {
    expect(spyCementHelper.called).to.be.equal(true);
    expect(spyCementPublish.called).to.be.equal(true);
    expect(spyCementDestinations.called).to.be.equal(true);
    spyChannels.forEach((spy) => {
      expect(spy.calledOnce).to.be.equal(true);
    });
    done();
  });

  after(function(done) {
    brick.cementHelper.publish.restore();
    cement.publish.restore();
    cement.getDestinations.restore();
    destinations.forEach((channel) => {
      channel.publish.restore();
    });
    done();
  });
});
