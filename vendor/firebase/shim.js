/* globals Firebase */

(function() {
  function fakeFirebase() {
    var error = "Firebase is not available. Either the bower package is missing or your app is in Fastboot Mode.";
    this.to = function() {
      throw Error(error);
    };
    throw Error(error);
  }

  function vendorModule() {
    'use strict';
    return {'default': self['firebase'] || fakeFirebase};
  }

  define('firebase', [], vendorModule);
})();
