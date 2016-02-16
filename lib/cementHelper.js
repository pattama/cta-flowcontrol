/**
 * Created by U6020429 on 12/02/2016.
 */
'use strict';

const Context = require('./context');

class CementHelper {
  constructor(cement, brickName) {
    if (typeof brickName !== 'string') {
      throw new TypeError('incorrect brickName');
    }
    this.cement = cement;
    this.brickName = brickName;
  }

  createContext(data) {
    return new Context(this, data);
  }

  send(context) {
    this.cement.send(context);
  }
}

exports = module.exports = CementHelper;
