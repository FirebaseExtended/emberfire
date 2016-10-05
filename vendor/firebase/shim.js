/* globals firebase */
var fb;

if (window.FastBoot) {
  fb = FastBoot.require('firebase');
} else {
  fb = firebase;
}

define('firebase', [], function() {
  "use strict";

  return {
    'default': fb
  };
});
