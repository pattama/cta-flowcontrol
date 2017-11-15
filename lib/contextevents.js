/**
 * This source code is provided under the Apache 2.0 license and is provided
 * AS IS with no warranty or guarantee of fit for purpose. See the project's
 * LICENSE.md for details.
 * Copyright 2017 Thomson Reuters. All rights reserved.
 */

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
