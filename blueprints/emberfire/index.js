/* jshint node: true */
'use strict';

var SilentError = require('ember-cli/lib/errors/silent');

module.exports = {
  normalizeEntityName: function() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },

  availableOptions: [
    { name: 'url', type: String }
  ],

  locals: function(options) {
    if (!options.url) {
      throw new SilentError('you need to provide a firebase url e.g. ember generate emberfire --url=https://YOUR-FIREBASE-NAME.firebaseio.com/')
    }

    return {
      modulePrefix: options.project.pkg.name,
      firebaseUrl: options.url
    }
  },

  afterInstall: function() {
    return this.addBowerPackagesToProject([
        {name: 'emberfire', target: "~0.0.0"}
    ]);
  }
};
