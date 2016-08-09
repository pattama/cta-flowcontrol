'use strict';

const Tool = require('cta-tool');

class T0 extends Tool {
  constructor(dependencies, configuration) {
    super(dependencies, configuration);
    this.name = 'T0';
  }
}

module.exports = T0;
