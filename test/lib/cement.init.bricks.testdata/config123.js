'use strict';

const config = {
  'bricks': [
//------------------------------------------------------------------------
    {
      name: 'One',
      module: './test/lib/cement.init.bricks.testdata/one.js',
      properties: {
      },
      subscribe: [{
        topic: 'topics.com',
        data: [{}],
      }],
    },
//------------------------------------------------------------------------
    {
      name: 'Two',
      module: './test/lib/cement.init.bricks.testdata/two.js',
      properties: {},
      subscribe: [{
        topic: 'topics.com',
        data: [{}],
      }],
      publish: [{
        topic: 'topics.com',
        data: [{}],
      }],
    },
//------------------------------------------------------------------------
    {
      name: 'Three',
      module: './test/lib/cement.init.bricks.testdata/three.js',
      properties: {},
      publish: [{
        topic: 'topics.com',
        data: [{}],
      }],
    },
//------------------------------------------------------------------------
  ],
};

module.exports = config;
