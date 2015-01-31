'use strict';

var path = require('path');

module.exports = {
  name: 'EmberFire',

  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints');
  },

  included: function included(app) {
    this._super.included(app);

    var options = {
      exports: {
        'firebase': [
          'default'
        ],
        'emberfire': [
          'default'
        ]
      }
    };

    this.app.import({
      development: app.bowerDirectory + '/firebase/firebase-debug.js',
      production: app.bowerDirectory + '/firebase/firebase.js'
    });

    this.app.import({
      development: app.bowerDirectory + '/emberfire/dist/emberfire.js',
      production: app.bowerDirectory + '/emberfire/dist/emberfire.min.js'
    }, options);
  }
};
