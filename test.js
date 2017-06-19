/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var insist = require('./');

// finds correct usage
insist.throws(function() {
  insist({ a: 1 });
  insist(false);
  insist(0);
}, /insist\(false\);$/);

// finds multi-line call
insist.throws(function() {
  insist(false ?
    true :
    false);
}, /insist\(false \?\s+true :\s+false\);$/);

// equal
insist.throws(function() {
  var foo = 'bar';
  var baz = 'quux';
  insist.equal(foo, baz);
}, /^AssertionError: 'bar' == 'quux' from insist.equal\(foo, baz\)/);

// trace
try {
  (function trace() {
    insist.ok(false);
  })();
} catch (e) {
  (function() {
    var lines = e.stack.split('\n');
    var expected = '    at trace (';
    insist.equal(lines[1].slice(0, expected.length), expected);
  })();
}

// throws
insist.throws(function() {
  insist.throws(function noop(){});
},/Missing expected exception\.\.? from insist.throws\(function noop\(\){}\);/);


// if we get here, everything passed
console.log('All good!');
