'use strict';
const FlowControl = require('cta-flowcontrol');
const Cement = FlowControl.Cement;

let config;
const argvIndexConfig = process.argv.indexOf('-c');
if (argvIndexConfig !== -1) {
  try {
    config = require(process.argv[argvIndexConfig + 1]);
  } catch (error) {
    throw new Error('failed loading configuration file: ' + error.message);
  }
} else {
  throw new Error('missing configuration path argument (-c)');
}
const cement = new Cement(config); // eslint-disable-line no-unused-vars
