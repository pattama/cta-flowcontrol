'use strict';

module.exports = {
  tools: [{
    name: 'logger',
    module: 'cta-logger',
    properties: {},
    global: true,
    scope: 'bricks', // all, tools
    singleton: false,
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
    singleton: true,
    dependencies: {
      messaging: 'messaging',
    },
    properties: {
      port: 8090,
      newInstance: true,
    },
  }],
  bricks: [{
    name: 'one',
    module: 'cta-brick',
    dependencies: {
      messagingOne: 'messaging',
    },
    properties: {},
    publish: [{
      topic: 'topics.com',
      data: [{}],
    }],
  }, {
    name: 'two',
    module: 'cta-brick',
    properties: {},
    dependencies: {
      healthCheckTwo: 'healthcheck',
    },
    subscribe: [{
      topic: 'topics.com',
      data: [{}],
    }],
  }, {
    name: 'three',
    module: 'cta-brick',
    dependencies: {
      messagingThree: 'messaging',
      healthCheckThree: 'healthcheck',
    },
    properties: {},
    subscribe: [{
      topic: 'topics.com',
      data: [{}],
    }],
  }],
};
