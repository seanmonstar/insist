# insist

[![Build Status](https://travis-ci.org/seanmonstar/insist.png?branch=master)](https://travis-ci.org/seanmonstar/insist)
[![NPM version](https://badge.fury.io/js/insist.png)](http://badge.fury.io/js/insist)

A drop-in replacement for `assert`, with a better default message.

```js
var assert = require('insist');

// AssertionError: assert(3 instanceof Function);
assert(3 instanceof Function);

//plus all properties of assert
assert.equal(foo, bar); // AssertionError: "baz" == "quux" from assert.equal(foo, bar);
assert.ok();
assert.deepEqual();
// etc...
```

Also, turn off these assertions with `NO_ASSERT=1` env var.
