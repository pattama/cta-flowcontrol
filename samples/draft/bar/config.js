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
    module: '../samples/home/bar/bar1.js',
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
    module: '../samples/home/bar/bar2.js',
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
