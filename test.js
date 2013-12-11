/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var insist = require('./');

insist.throws(function() {
  insist({ a: 1 });
  insist(false);
  insist(0);
}, /insist\(false\);$/);

insist.throws(function() {
  insist(false ?
    true :
    false);
}, /insist\(false \?\s+true :\s+false\);$/);
