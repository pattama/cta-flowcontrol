'use strict';

const config = {
  bricks: [
    {
      'name': 'one',
      'module': 'cta-brick',
      'properties': {},
      'publish': [
        {
          'topic': 'one.two',
          'data': [{}],
        },
      ],
    },
    {
      'name': 'two',
      'module': 'cta-brick',
      'properties': {},
      'subscribe': [
        {
          'topic': 'one.two',
          'data': [{}],
        },
      ],
      'publish': [
        {
          'topic': 'two.three',
          'data': [{}],
        },
      ],
    },
    {
      'name': 'three',
      'module': 'cta-brick',
      'properties': {},
      'subscribe': [
        {
          'topic': 'two.three',
          'data': [{}],
        },
      ],
    },
  ],
};

module.exports = config;
