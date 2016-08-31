/* globals Firebase */

(function() {
  function FakeFirebase() {
    var error = "Firebase is not available. Either the bower package is missing or your app is in Fastboot Mode.";

    throw Error(error);
  }

  function vendorModule() {
    'use strict';
    return {'default': self['firebase'] || FakeFirebase};
  }

  define('firebase', [], vendorModule);
})();
