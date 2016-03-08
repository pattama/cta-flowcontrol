'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');
require('sinon-as-promised');

const Channel = require('../lib/channel');
const Context = require('../lib/context');

describe('Channel - instantiate', function() {
  context('when missing/incorrect \'topic\' string property', function() {
    it('should throw an error', function() {
      return expect(function() {
        return new Channel();
      }).to.throw(Error, 'missing/incorrect \'topic\' string property');
    });
  });

  context('when valid', function() {
    it('should return a new Channel', function(done) {
      const topic = 'some.topic';
      const channel = new Channel(topic);
      expect(channel).to.be.an.instanceof(Channel);
      expect(channel).to.have.property('topic', topic);
      expect(channel).to.have.property('publishers').and.to.be.a('Map');
      expect(channel).to.have.property('subscribers').and.to.be.a('Map');
      done();
    });
  });
});

describe('Channel - add publisher', function() {
  let channel;
  before(function() {
    channel = new Channel('some.topic');
  });

  context('when missing/incorrect \'name\' string property', function() {
    it('should throw an error', function() {
      return expect(function() {
        channel.addPublisher();
      }).to.throw(Error, 'missing/incorrect \'name\' string property');
    });
  });

  context('when missing/incorrect \'data\' Array property', function() {
    it('should throw an error', function() {
      return expect(function() {
        channel.addPublisher('publisher1');
      }).to.throw(Error, 'missing/incorrect \'data\' Array property');
    });
  });

  context('when empty \'data\' Array property', function() {
    it('should throw an error', function() {
      return expect(function() {
        channel.addPublisher('publisher1', []);
      }).to.throw(Error, 'empty \'data\' Array property');
    });
  });

  context('when missing/incorrect \'brick\' object property', function() {
    it('should throw an error', function() {
      return expect(function() {
        channel.addPublisher('publisher1', [{}]);
      }).to.throw(Error, 'missing/incorrect \'brick\' object property');
    });
  });

  context('when valid arguments', function() {
    it('should add the publisher, return channel', function() {
      const name = 'publisher1';
      const data = [{ type: 'foobar'}];
      const brick = {};
      expect(channel.addPublisher(name, data, brick)).to.equal(channel);
      expect(channel.publishers.has(name)).to.equal(true);
      expect(channel.publishers.get(name)).to.have.property('data').and.to.deep.equal(data);
      expect(channel.publishers.get(name)).to.have.property('brick').and.to.deep.equal(brick);
    });
  });

  context('when valid arguments but publisher already exists', function() {
    it('should add the data contracts to the existing publisher (concat)', function() {
      const name = 'publisher2';
      const data = [{ type: 'foobar'}];
      const data2 = [{ type: 'foobar2'}];
      const brick = {};
      channel.addPublisher(name, data, brick).addPublisher(name, data2, {});
      expect(channel.publishers.has(name)).to.equal(true);
      expect(channel.publishers.get(name)).to.have.property('data').and.to.deep.equal(data.concat(data2));
    });
  });
});

describe('Channel - add subscriber', function() {
  let channel;
  before(function() {
    channel = new Channel('some.topic');
  });

  context('when missing/incorrect \'name\' string property', function() {
    it('should throw an error', function() {
      return expect(function() {
        channel.addSubscriber();
      }).to.throw(Error, 'missing/incorrect \'name\' string property');
    });
  });

  context('when missing/incorrect \'data\' Array property', function() {
    it('should throw an error', function() {
      return expect(function() {
        channel.addSubscriber('subscriber1');
      }).to.throw(Error, 'missing/incorrect \'data\' Array property');
    });
  });

  context('when empty \'data\' Array property', function() {
    it('should throw an error', function() {
      return expect(function() {
        channel.addSubscriber('subscriber1', []);
      }).to.throw(Error, 'empty \'data\' Array property');
    });
  });

  context('when missing/incorrect \'brick\' object property', function() {
    it('should throw an error', function() {
      return expect(function() {
        channel.addSubscriber('subscriber1', [{}]);
      }).to.throw(Error, 'missing/incorrect \'brick\' object property');
    });
  });

  context('when valid arguments', function() {
    it('should add the subscriber, return channel', function() {
      const name = 'subscriber1';
      const data = [{ type: 'foobar'}];
      const brick = {};
      expect(channel.addSubscriber(name, data, brick)).to.equal(channel);
      expect(channel.subscribers.has(name)).to.equal(true);
      expect(channel.subscribers.get(name)).to.have.property('data').and.to.deep.equal(data);
      expect(channel.subscribers.get(name)).to.have.property('brick').and.to.deep.equal(brick);
    });
  });

  context('when valid arguments but subscriber already exists', function() {
    it('should add the data contracts to the existing subscriber (concat)', function() {
      const name = 'subscribers2';
      const data = [{ type: 'foobar'}];
      const data2 = [{ type: 'foobar2'}];
      const brick = {};
      channel.addSubscriber(name, data, brick).addSubscriber(name, data2, brick);
      expect(channel.subscribers.has(name)).to.equal(true);
      expect(channel.subscribers.get(name)).to.have.property('data').and.to.deep.equal(data.concat(data2));
    });
  });
});

describe('Channel - check publisher can produce data', function() {
  let channel;
  before(function() {
    channel = new Channel('some.topic');
    const name = 'publisher1';
    const dataContracts = [
      {
        nature: {
          type: 'foobar',
        },
      },
    ];
    const brick = {};
    channel.addPublisher(name, dataContracts, brick);
  });

  context('when missing/incorrect \'name\' string property', function() {
    it('should throw an error', function() {
      return expect(function() {
        channel.canPublish();
      }).to.throw(Error, 'missing/incorrect \'name\' string property');
    });
  });

  context('when missing/incorrect \'data\' object property', function() {
    it('should throw an error', function() {
      return expect(function() {
        channel.canPublish('publisher1', '');
      }).to.throw(Error, 'missing/incorrect \'data\' object property');
    });
  });

  context('when publisher is not found', function() {
    it('should return true', function() {
      expect(channel.canPublish('not-publisher1', {})).to.equal(false);
    });
  });

  context('when data contract is fulfilled', function() {
    it('should return true', function() {
      expect(channel.canPublish('publisher1', {
        nature: {
          type: 'foobar',
        },
        payload: {
          foo: 'bar',
        },
      })).to.equal(true);
      expect(channel.canPublish('publisher1', {
        nature: {
          type: 'foobar',
          quality: 'whatever',
        },
        payload: {
          foo: 'bar',
        },
      })).to.equal(true);
    });
  });

  context('when data contract is not fulfilled', function() {
    it('should return true', function() {
      expect(channel.canPublish('publisher1', {
        nature: {
          type: 'not-foobar',
        },
        payload: {
          foo: 'bar',
        },
      })).to.equal(false);
    });
  });
});

describe('Channel - check subscriber can consume data', function() {
  let channel;
  before(function() {
    channel = new Channel('some.topic');
    const name = 'subscriber1';
    const dataContracts = [
      {
        nature: {
          type: 'foobar',
        },
      },
    ];
    const brick = {};
    channel.addSubscriber(name, dataContracts, brick);
  });

  context('when missing/incorrect \'name\' string property', function() {
    it('should throw an error', function() {
      return expect(function() {
        channel.canConsume();
      }).to.throw(Error, 'missing/incorrect \'name\' string property');
    });
  });

  context('when missing/incorrect \'data\' object property', function() {
    it('should throw an error', function() {
      return expect(function() {
        channel.canConsume('subscriber1', '');
      }).to.throw(Error, 'missing/incorrect \'data\' object property');
    });
  });

  context('when subscriber is not found', function() {
    it('should return true', function() {
      expect(channel.canConsume('not-subscriber1', {})).to.equal(false);
    });
  });

  context('when data contract is fulfilled', function() {
    it('should return true', function() {
      expect(channel.canConsume('subscriber1', {
        nature: {
          type: 'foobar',
        },
        payload: {
          foo: 'bar',
        },
      })).to.equal(true);
      expect(channel.canConsume('subscriber1', {
        nature: {
          type: 'foobar',
          quality: 'whatever',
        },
        payload: {
          foo: 'bar',
        },
      })).to.equal(true);
    });
  });

  context('when data contract is not fulfilled', function() {
    it('should return true', function() {
      expect(channel.canConsume('subscriber1', {
        nature: {
          type: 'not-foobar',
        },
        payload: {
          foo: 'bar',
        },
      })).to.equal(false);
    });
  });
});

describe('Channel - get subscribers that can consume data', function() {
  let channel;
  const name1 = 'subscriber1';
  const dataContracts1 = [
    {
      nature: {
        type: 'foobar',
      },
    },
  ];
  const brick1 = {};
  const name2 = 'subscriber2';
  const dataContracts2 = [
    {
      nature: {
        type: 'foobar',
      },
    },
    {
      nature: {
        type: 'foobar2',
      },
    },
  ];
  const brick2 = {};
  before(function() {
    channel = new Channel('some.topic');
    channel.addSubscriber(name1, dataContracts1, brick1);
    channel.addSubscriber(name2, dataContracts2, brick2);
  });

  context('when missing/incorrect \'data\' object property', function() {
    it('should throw an error', function() {
      return expect(function() {
        channel.getSubscribers('');
      }).to.throw(Error, 'missing/incorrect \'data\' object property');
    });
  });

  context('when data contract is fulfilled #1', function() {
    it('should return true', function() {
      const subscribers = channel.getSubscribers({
        nature: {
          type: 'foobar',
        },
        payload: {
          foo: 'bar',
        },
      });
      expect(subscribers).to.be.an('Array');
      expect(subscribers).to.have.lengthOf(2);
      expect(subscribers).to.contain(name1);
      expect(subscribers).to.contain(name2);
    });
  });

  context('when data contract is fulfilled #2', function() {
    it('should return true', function() {
      const subscribers = channel.getSubscribers({
        nature: {
          type: 'foobar2',
        },
        payload: {
          foo: 'bar',
        },
      });
      expect(subscribers).to.be.an('Array');
      expect(subscribers).to.have.lengthOf(1);
      expect(subscribers).to.contain(name2);
    });
  });

  context('when data contract is not fulfilled', function() {
    it('should return true', function() {
      const subscribers = channel.getSubscribers({
        nature: {
          type: 'not-fulfill-foobar',
        },
        payload: {
          foo: 'bar',
        },
      });
      expect(subscribers).to.be.an('Array');
      expect(subscribers).to.have.lengthOf(0);
    });
  });
});

describe('Channel - produce data, make subscribers consume', function() {
  let channel;
  const name1 = 'subscriber1';
  const dataContracts1 = [
    {
      nature: {
        type: 'foobar1',
      },
    },
  ];
  const brick1 = {
    onData: function(context) {
      console.log(context);
    },
  };
  const spyOnData1 = sinon.spy(brick1, 'onData');
  const name2 = 'subscriber2';
  const dataContracts2 = [
    {
      nature: {
        type: 'foobar2',
      },
    },
  ];
  const brick2 = {
    onData: function(context) {
      console.log(context);
    },
  };
  const spyOnData2 = sinon.spy(brick2, 'onData');
  before(function() {
    channel = new Channel('some.topic');
    channel.addSubscriber(name1, dataContracts1, brick1);
    channel.addSubscriber(name2, dataContracts2, brick2);
  });

  context('when subscriber(s) can consume', function() {
    it(`should call subscribers' brick instance\'s onData method`, function() {
      const context = new Context({}, {
        nature: {
          type: 'foobar1',
          quality: 'whatever',
        },
        payload: {
          foo: 'bar',
        },
      });
      channel.publish(context);
      expect(spyOnData1.calledOnce).to.equal(true);
      expect(spyOnData2.called).to.equal(false);
    });
  });
});
