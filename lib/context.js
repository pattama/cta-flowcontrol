/**
 * Created by U6020429 on 12/02/2016.
 */
'use strict';
const EventEmitter = require('events');

class Context extends EventEmitter {
  constructor(cementHelper, data) {
    super();
    this.cementHelper = cementHelper;
    this.from = cementHelper.brickName;
    this.data = data;
  }

  send() {
    this.cementHelper.send(this);
  }
}

exports = module.exports = Context;
