'use strict';

const Tool = require('cta-tool');

class T1 extends Tool {
  constructor(dependencies, configuration) {
    super(dependencies, configuration);
    this.name = 'T1';
  }
}

module.exports = T1;
