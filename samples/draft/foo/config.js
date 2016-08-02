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
    name: 'Foo1',
    module: '../samples/draft/foo/foo1.js',
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
    name: 'Foo2',
    module: '../samples/draft/foo/foo2.js',
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
