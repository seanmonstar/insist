/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*const*/ var assert = require('assert');
/*const*/ var fs = require('fs');

/*const*/ var esprima = require('esprima');
/*const*/ var stack = require('stack-trace');

/*const*/ var NO_ASSERT = process.env.NO_ASSERT;
/*const*/ var DONT_DECORATE = ['ok', 'fail', 'AssertionError'];

function noop() {}

function traverse(node, func) {
  func(node);
  function _traverseChild(node) {
    traverse(node, func);
  }
  for (var key in node) {
    if (node.hasOwnProperty(key)) {
      var child = node[key];
      if (typeof child === 'object' && child !== null) {

        if (Array.isArray(child)) {
          child.forEach(_traverseChild);
        } else {
          traverse(child, func);
        }
      }
    }
  }
}

function getSource(trace) {
  var src = fs.readFileSync(trace.getFileName(), 'utf8');
  var tree = esprima.parse(src, { loc: true });
  var startLine = trace.getLineNumber();
  var startCol = trace.getColumnNumber();
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

  // add on assert or insist
  // ex: equals() becomes assert.equals()
  var a = 'assert';
  var i = 'insist';
  var mod = lines[0].substring(startCol - a.length - 2, startCol - 2);
  if (mod === a || mod === i) {
    startCol = startCol - a.length - 2;
  }

  lines[0] = lines[0].substring(startCol - 1);
  lines[lines.length - 1] = lines[lines.length - 1].substring(0, endCol - 1);

  return lines.join('\n').trim();
}

function getMessage() {
  var trace = stack.get()[2];
  var fileName = trace.getFileName();
  if (fileName !== 'repl') {
    return getSource(trace);
  } else {
    return trace.fun.toString();
  }
}



function decorate(key) {
  return function insist() {
    try {
      assert[key].apply(assert, arguments);
    } catch (err) {
      if (err instanceof assert.AssertionError) {
        var srcMsg = getMessage();
        if (err.message) {
          err.message += ' from ' + srcMsg;
        } else {
          err.message = srcMsg;
        }
      }
      throw err;
    }
  };
}

var insist = NO_ASSERT ? noop : decorate('ok');

Object.keys(assert).forEach(function(key) {
  if (DONT_DECORATE.indexOf(key) !== -1) {
    insist[key] = assert[key];
  } else {
    insist[key] = NO_ASSERT ? noop : decorate(key);
  }
});
insist.ok = insist;

module.exports = insist;
