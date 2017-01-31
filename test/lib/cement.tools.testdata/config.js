'use strict';

module.exports = {
  tools: [{
    name: 't0',
    module: './test/lib/cement.tools.testdata/t0.js',
    properties: {},
    scope: 'all',
  }, {
    name: 't1',
    module: './test/lib/cement.tools.testdata/t1.js',
    properties: {},
    scope: 'bricks',
  }, {
    name: 't2',
    module: './test/lib/cement.tools.testdata/t2.js',
    properties: {},
    dependencies: {
      t1: 't1',
    },
  }, {
    name: 't3',
    module: './test/lib/cement.tools.testdata/t3.js',
    properties: {},
    dependencies: {
      t3a: 't1',
      t3b: 't2',
    },
  }],
  bricks: [{
    name: 'b1',
    module: 'cta-brick',
    properties: {},
    publish: [{
      topic: 'topics.com',
      data: [{}],
    }],
  }, {
    name: 'b2',
    module: 'cta-brick',
    properties: {},
    dependencies: {
      t2: 't2',
    },
    subscribe: [{
      topic: 'topics.com',
      data: [{}],
    }],
  }, {
    name: 'b3',
    module: 'cta-brick',
    properties: {},
    dependencies: {
      t0: 't3', // override global dependency t0
    },
    subscribe: [{
      topic: 'topics.com',
      data: [{}],
    }],
  }],
};
