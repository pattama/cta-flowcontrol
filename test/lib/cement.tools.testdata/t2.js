'use strict';

const Tool = require('cta-tool');

class T2 extends Tool {
  constructor(dependencies, configuration) {
    super(dependencies, configuration);
    this.name = 'T2';
  }
}

module.exports = T2;
