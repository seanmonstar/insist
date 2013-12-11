# insist

A drop-in replacement for `assert`, with a better default message.

```js
var assert = require('insist');

// AssertionError: assert(3 instanceof Function);
assert(3 instanceof Function);

//plus all properties of assert like normal;
assert.equal();
assert.ok();
assert.deepEqual();
// etc...
```
