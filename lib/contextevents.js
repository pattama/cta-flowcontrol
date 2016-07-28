'use strict';

// list of default events authorized in a Context (as a SmartEventEmitter)
// 'error' is already authorized by default

const events = [
  'accept',
  'reject',
  'progress',
  'done',
];

module.exports = events;
