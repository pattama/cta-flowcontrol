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
    singleton: true,
    properties: {
      provider: 'rabbitmq',
      parameters: {
        url: 'amqp://localhost?heartbeat=60',
      },
    },
  }, {
    name: 'healthCheck',
    module: 'cta-healthcheck',
    dependencies: ['messaging'],
    properties: {
      port: 8080,
    },
  }],
  bricks: [{
    name: 'one',
    module: 'cta-brick',
    dependencies: ['logger', 'messaging', 'healthCheck'],
    properties: {},
    publish: [{
      topic: 'topics.com',
      data: [{}],
    }],
  }, {
    name: 'two',
    module: 'cta-brick',
    dependencies: ['logger'],
    properties: {},
    subscribe: [{
      topic: 'topics.com',
      data: [{}],
    }],
  }, {
    name: 'three',
    module: 'cta-brick',
    dependencies: ['healthCheck'],
    properties: {},
    subscribe: [{
      topic: 'topics.com',
      data: [{}],
    }],
  }],
};
