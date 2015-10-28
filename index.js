/* jshint node: true */
'use strict';

module.exports = {
  name: 'emberfire',

  included: function included(app) {
    this._super.included(app);

    // make sure app is correctly assigned when being used as a nested addon
    if (app.app) {
      app = app.app;
    }
    this.app = app;

    this.app.import({
      development: app.bowerDirectory + '/firebase/firebase-debug.js',
      production: app.bowerDirectory + '/firebase/firebase.js'
    });

    app.import('vendor/firebase/shim.js', {
      type: 'vendor',
      exports: { 'firebase': ['default'] }
    });
  }
};
