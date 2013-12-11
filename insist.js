/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const assert = require('assert');
const fs = require('fs');

const esprima = require('esprima');
const stack = require('stack-trace');

function insist(expression, message) {
  if (expression) {
    return;
  }
  if (!message) {
    var trace = stack.get()[1];
    var fileName = trace.getFileName();
    var line = trace.getLineNumber();
    if (fileName !== 'repl') {
      message = getMessage(fs.readFileSync(fileName, 'utf8'), line,
          trace.getColumnNumber());
    } else {
      message = trace.fun.toString();
    }

  }

  return assert(false, message);
}

function getMessage(src, line, col) {
  var tree = esprima.parse(src, { loc: true });
  var startLine = line;
  var startCol = col;
  var endLine = Infinity;
  var endCol = Infinity;
  traverse(tree, function(node) {
    if (node.type === 'CallExpression') {
      if (node.loc.start.line > startLine || node.loc.start.col > startCol) {
        return;
      }
      if (node.loc.end.line < startLine || node.loc.end.col < startCol) {
        return;
      }
      if (node.loc.end.line < endLine) {
        endLine = node.loc.end.line;
      }
      if (node.loc.end.col < endCol) {
        endCol = node.loc.end.col;
      }
    }
  });

  var lines = String(src).split(/\r?\n/);
  lines = lines.slice(startLine - 1, endLine - lines.length);

  lines[0] = lines[0].substring(startCol - 1);
  lines[lines.length - 1] = lines[lines.length - 1].substring(0, endCol - 1);

  return lines.join('\n').trim();
}

function traverse(node, func) {
  func(node);//1
  for (var key in node) { //2
    if (node.hasOwnProperty(key)) { //3
      var child = node[key];
      if (typeof child === 'object' && child !== null) { //4

        if (Array.isArray(child)) {
          child.forEach(function(node) { //5
            traverse(node, func);
          });
        } else {
          traverse(child, func); //6
        }
      }
    }
  }
}



Object.keys(assert).forEach(function(key) {
  insist[key] = assert[key];
});

module.exports = insist;
