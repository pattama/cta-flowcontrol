'use strict';

module.exports = {
  tools: [{
    name: 'healthCheck',
    module: 'cta-healthcheck',
    properties: {
      port: 3000,
    },
    scope: 'bricks',
  }],
  bricks: [{
    name: 'Bar1',
    module: '../samples/draft/bar/bar1.js',
    publish: [{
      topic: 'topics',
      data: [{
        nature: {
          type: 'logs',
          quality: 'something',
        },
      }],
    }],
  }, {
    name: 'Bar2',
    module: '../samples/draft/bar/bar2.js',
    subscribe: [{
      topic: 'topics',
      data: [{
        nature: {
          type: 'logs',
          quality: 'something',
        },
      }],
    }],
  }],
};
