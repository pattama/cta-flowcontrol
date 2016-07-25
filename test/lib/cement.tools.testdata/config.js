'use strict';

module.exports = {
  tools: [{
    name: 'logger',
    module: 'cta-logger',
    properties: {},
    global: true,
  }, {
    name: 'messaging',
    module: 'cta-messaging',
    properties: {
      provider: 'rabbitmq',
      parameters: {
        url: 'amqp://localhost?heartbeat=60',
        newInstance: true,
      },
    },
  }, {
    name: 'healthcheck',
    module: 'cta-healthcheck',
    dependencies: ['messaging'],
    properties: {
      port: 8090,
      newInstance: true,
    },
  }],
  bricks: [{
    name: 'one',
    module: 'cta-brick',
    dependencies: ['messaging'],
    properties: {},
    publish: [{
      topic: 'topics.com',
      data: [{}],
    }],
  }, {
    name: 'two',
    module: 'cta-brick',
    properties: {},
    dependencies: ['healthcheck'],
    subscribe: [{
      topic: 'topics.com',
      data: [{}],
    }],
  }, {
    name: 'three',
    module: 'cta-brick',
    dependencies: ['messaging', 'healthcheck'],
    properties: {},
    subscribe: [{
      topic: 'topics.com',
      data: [{}],
    }],
  }],
};
