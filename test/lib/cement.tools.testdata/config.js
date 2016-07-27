'use strict';

module.exports = {
  tools: [{
    name: 't0',
    module: '../test/lib/cement.tools.testdata/tool.js',
    properties: {},
  }, {
    name: 't1',
    module: '../test/lib/cement.tools.testdata/tool.js',
    properties: {},
    scope: 'all',
  }, {
    name: 't2',
    module: '../test/lib/cement.tools.testdata/tool.js',
    properties: {},
    scope: 'tools',
  }, {
    name: 't3',
    module: '../test/lib/cement.tools.testdata/tool.js',
    properties: {},
    scope: 'bricks',
  }, {
    name: 't4',
    module: '../test/lib/cement.tools.testdata/tool.js',
    properties: {},
    dependencies: {
      t4t0: 't0',
    },
  }, {
    name: 't5',
    module: '../test/lib/cement.tools.testdata/tool.js',
    properties: {},
    dependencies: {
      t5t0: 't0',
      t5t4: 't4',
    },
  }],
  bricks: [{
    name: 'b1',
    module: 'cta-brick',
    dependencies: {
      b1t2: 't2',
      b1t0: 't0',
    },
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
      b2t5: 'b2t5',
      t3: 't4', // override global dependency t3
    },
    subscribe: [{
      topic: 'topics.com',
      data: [{}],
    }],
  }, {
    name: 'b3',
    module: 'cta-brick',
    properties: {},
    subscribe: [{
      topic: 'topics.com',
      data: [{}],
    }],
  }],
};
