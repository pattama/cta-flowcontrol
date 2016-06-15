'use strict';

const fs = require('fs');
const path = require('path');

/**
 * explore recursively a directory of config files to return one concatenated object 'config'
 * folders on first depth are 'config' properties
 * files inside those folders are values of those properties:
 * - if file is 'index.js' then the value is what is exported by the file 'module.exports = ...'
 * - otherwise, the value is an array of what is exported by those files
 * See tests/lib/config.test.js for a sample
 * @param {String} dir - full path to config files folder
 * @returns {Object|Array}
 */
function explore(dir) {
  try {
    let obj = {};
    const arr = [];
    const files = fs.readdirSync(dir);
    let filePath;
    files.forEach(function(file) {
      filePath = dir + path.sep + file;
      if (fs.statSync(filePath).isDirectory()) {
        obj[file] = explore(filePath);
      } else if (file === 'index.js') {
        obj = require(filePath);
      } else {
        arr.push(require(filePath));
      }
    });
    return (arr.length > 0) ? arr : obj;
  } catch (e) {
    throw new Error(`Can't explore directory '${dir}', ${e.message}`);
  }
}

/**
 * exports main constructor
 * @param {String} dir - path to config files folder
 * @returns {Object|Array}
 *
 * Example:
 * A configuration with 'logger' and 2 bricks 'one', 'two':
 * /config/logger/index.js
 * /config/bricks/one.js
 * /config/bricks/two.js
 * Use:
 * const FlowControl = require('cta-flowcontrol');
 * const Cement = FlowControl.Cement;
 * const config = FlowControl.config(__dirname + '/config');
 * const cement = new Cement(config);
 */
module.exports = function(dir) {
  return explore(dir);
};
