/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const assert = require('assert');
const fs = require('fs');
const stack = require('stack-trace');

function insist(expression, message) {
  if (expression) return;
  if (!message) {
    var trace = stack.get()[1];
    var fileName = trace.getFileName();
    var src = trace.fun;
    if (fileName !== 'repl') {
      src = fs.readFileSync(fileName, 'utf8');
    }
    var line = trace.getLineNumber();
    message = String(src).split(/\r?\n/)[line - 1].trim();
  }

  return assert(false, message);
}

Object.keys(assert).forEach(function(key) {
  insist[key] = assert[key];
});

module.exports = insist;
