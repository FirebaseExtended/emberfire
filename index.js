/* jshint node: true */
'use strict';

module.exports = {
  name: 'EmberFire',

  included: function included(app) {
    this._super.included(app);

    this.app.import({
      development: app.bowerDirectory + '/firebase/firebase-debug.js',
      production: app.bowerDirectory + '/firebase/firebase.js'
    });
  }
};
