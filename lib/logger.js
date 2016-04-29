'use strict';

const os = require('os');
const path = require('path');
const loggerLib = require('cta-logger');

/**
 * cement logger module
 * @param {object} config - cement full configuration object
 * @param {object} config.logger - cement configuration object for logger
 * @param {string} author - author of the output log: cement or brick name
 * @return {object} - logger instance
 * */
module.exports = function(config, author) {
  // default options
  const filename = os.tmpDir() + path.sep + 'cta-flowcontrol.log';
  let options = {
    author: author || 'unknown',
    level: 'debug',
    filename: filename,
  };
  // cement config options
  if (typeof config === 'object' && 'properties' in config && typeof config.properties === 'object' && Object.keys(config.properties).length > 0) {
    options = config.properties;
    options.author = author || 'unknown';
  }
  const logger = loggerLib(options);
  logger.info('Instantiated logger module');
  return logger;
};
