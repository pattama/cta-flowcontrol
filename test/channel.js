'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

const Channel = require('../lib/channel');

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

describe('Channel - getters', function() {
  let channel;
  before(function() {
    channel = new Channel('some.topic');
  });

  //describe('get topic', function() {
  //  it('should return Map of publishers', function() {
  //    expect(channel.getPublishers()).to.be.deep.equal(channel.publishers);
  //  })
  //});
  //
  //describe('get publishers', function() {
  //  it('should return Map of publishers', function() {
  //    expect(channel.getPublishers()).to.be.deep.equal(channel.publishers);
  //  })
  //});
  //
  //describe('get subscribers', function() {
  //  it('should return Map of subscribers', function() {
  //    expect(channel.getSubscribers()).to.be.deep.equal(channel.subscribers);
  //  })
  //});
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

  context('when valid arguments', function() {
    it('should add the publisher, return channel', function() {
      const name = 'publisher1';
      const data = [{ type: 'foobar'}];
      expect(channel.addPublisher(name, data)).to.equal(channel);
      expect(channel.publishers.has(name)).to.equal(true);
      expect(channel.publishers.get(name)).to.deep.equal(data);
    });
  });

  context('when valid arguments but publisher already exists', function() {
    it('should add the data contracts to the existing publisher (concat)', function() {
      const name = 'publisher2';
      const data = [{ type: 'foobar'}];
      const data2 = [{ type: 'foobar2'}];
      channel.addPublisher(name, data).addPublisher(name, data2);
      expect(channel.publishers.has(name)).to.equal(true);
      expect(channel.publishers.get(name)).to.deep.equal(data.concat(data2));
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

  context('when valid arguments', function() {
    it('should add the subscriber, return channel', function() {
      const topic = 'subscriber1';
      const data = [{ type: 'foobar'}];
      expect(channel.addSubscriber(topic, data)).to.equal(channel);
      expect(channel.subscribers.has(topic)).to.equal(true);
      expect(channel.subscribers.get(topic)).to.deep.equal(data);
    });
  });

  context('when valid arguments but subscriber already exists', function() {
    it('should add the data contracts to the existing subscriber (concat)', function() {
      const topic = 'subscribers2';
      const data = [{ type: 'foobar'}];
      const data2 = [{ type: 'foobar2'}];
      channel.addSubscriber(topic, data).addSubscriber(topic, data2);
      expect(channel.subscribers.has(topic)).to.equal(true);
      expect(channel.subscribers.get(topic)).to.deep.equal(data.concat(data2));
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
    channel.addPublisher(name, dataContracts);
  });

  context('when missing/incorrect \'name\' string property', function() {
    it('should throw an error', function() {
      return expect(function() {
        channel.canProduce();
      }).to.throw(Error, 'missing/incorrect \'name\' string property');
    });
  });

  context('when missing/incorrect \'data\' object property', function() {
    it('should throw an error', function() {
      return expect(function() {
        channel.canProduce('publisher1', '');
      }).to.throw(Error, 'missing/incorrect \'data\' object property');
    });
  });

  context('when publisher is not found', function() {
    it('should return true', function() {
      expect(channel.canProduce('not-publisher1', {})).to.equal(false);
    });
  });

  context('when data contract is fulfilled', function() {
    it('should return true', function() {
      expect(channel.canProduce('publisher1', {
        nature: {
          type: 'foobar',
        },
        payload: {
          foo: 'bar',
        },
      })).to.equal(true);
      expect(channel.canProduce('publisher1', {
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
      expect(channel.canProduce('publisher1', {
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
    channel.addSubscriber(name, dataContracts);
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
  before(function() {
    channel = new Channel('some.topic');
    channel.addSubscriber(name1, dataContracts1);
    channel.addSubscriber(name2, dataContracts2);
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
