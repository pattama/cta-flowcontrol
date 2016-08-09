'use strict';

const Tool = require('cta-tool');

class T3 extends Tool {
  constructor(dependencies, configuration) {
    super(dependencies, configuration);
    this.name = 'T3';
  }
}

module.exports = T3;
