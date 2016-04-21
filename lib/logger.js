'use strict';

const os = require('os');
const path = require('path');
const loggerLib = require('cta-logger');

module.exports = function(config, author) {
  // default options
  const filename = os.tmpDir() + path.sep + 'cta-flowcontrol.log';
  let options = {
    author: author,
    level: 'debug',
    filename: filename,
  };
  // cement config options
  if (typeof config === 'object' && 'logger' in config && typeof config.logger === 'object') {
    options = config.logger;
    options.author = author;
  }
  const logger = loggerLib(options);
  logger.info('Instantiated logger module');
  return logger;
};
