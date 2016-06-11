'use strict';

const fs = require('fs');
const path = require('path');

/**
 * explore recursively a directory of config files to return one concatenated object 'config'
 * folders on first depth are 'config' properties
 * files under folders are values of those properties:
 * - if file is 'index.js' then it's an object
 * - else, files are array elements
 * See tests for a sample
 * @param {String} dir - path to config files
 * @returns {*}
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
 * exports main contructor
 * @param {String} dir - path to config files
 */
module.exports = function(dir) {
  return explore(dir);
};
