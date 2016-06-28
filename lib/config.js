'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

/**
 * explore recursively a directory of config files to return one concatenated object 'config'
 * folders on first depth are 'config' properties
 * files inside those folders are values of those properties:
 * - if file is 'index.js' then the value is what is exported by the file 'module.exports = ...'
 * - otherwise, the value is an array of what is exported by those files
 * See tests/lib/config.test.js for a sample
 * @param {String} dir - full path to config files folder
 * @returns {*}
 */
function explore(dir) {
  try {
    const obj = {};
    const arr = [];
    let index = null;
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = dir + path.sep + file;
      if (fs.statSync(filePath).isDirectory()) {
        obj[file] = explore(filePath);
      } else if (file === 'index.js') {
        index = _.cloneDeep(require(filePath));
      } else if (/\.js$/.test(file)) {
        arr.push(_.cloneDeep(require(filePath)));
      }
    });
    return index || (arr.length ? arr : null) || obj;
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
 * const cement = new Cement(__dirname + '/config');
 */
module.exports = function(dir) {
  return explore(dir);
};
