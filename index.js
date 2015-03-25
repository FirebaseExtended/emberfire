/* jshint node: true */
'use strict';

module.exports = {
  name: 'emberfire',

  included: function included(app) {
    this._super.included(app);

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
