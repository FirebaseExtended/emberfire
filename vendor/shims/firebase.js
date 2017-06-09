(function() {
  function vendorModule() {
    'use strict';

    return { 'default': FastBoot.require('firebase') };
  }

  if (window.FastBoot) {
    define('firebase', [], vendorModule);
  }
})();
