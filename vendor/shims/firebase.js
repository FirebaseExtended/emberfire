(function() {
  function vendorModule() {
    'use strict';

    return {
      'default': (window.FastBoot ? FastBoot.require('firebase') : self['firebase']),
      __esModule: true,
    };
  }

  define('firebase', [], vendorModule);
})();