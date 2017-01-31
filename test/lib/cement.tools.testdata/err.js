'use strict';

const Tool = require('cta-tool');

class Err extends Tool {
  constructor(dependencies, configuration) {
    super(dependencies, configuration);
    this.name = 'Err';
    throw new Error('some error');
  }
}

module.exports = Err;
