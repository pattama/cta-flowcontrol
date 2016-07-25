'use strict';

module.exports = {
  modules: [{
    name: 'logger',
    module: 'cta-logger',
    properties: {},
  }, {
    name: 'messaging',
    module: 'cta-messaging',
    dependencies: ['logger'],
    properties: {
      provider: 'rabbitmq',
      parameters: {
        url: 'amqp://localhost?heartbeat=60',
      },
    },
  }, {
    name: 'healthCheck',
    module: 'cta-healthcheck',
    dependencies: ['logger', 'messaging'],
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
