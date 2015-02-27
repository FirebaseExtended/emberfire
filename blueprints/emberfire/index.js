'use strict';

var EOL         = require('os').EOL;
var chalk       = require('chalk');

module.exports = {
  normalizeEntityName: function() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },

  availableOptions: [
    { name: 'url', type: String }
  ],

  afterInstall: function(options) {
    var firebaseUrl = options.url || 'https://YOUR-FIREBASE-NAME.firebaseio.com/';
    return this.addBowerPackagesToProject([
      {name: 'emberfire', target: "~0.0.0"}
    ]).then(function() {
      return this.insertIntoFile(
        'config/environment.js',
        '    firebase: \'' + firebaseUrl + '\',',
        {after: '    locationType: \'auto\',' + EOL}
      );
    }.bind(this)).then(function () {
      var output = EOL;
      output += chalk.yellow('EmberFire') + ' has been installed. Please configure your firebase URL in ' + chalk.green('config/environment.js') + EOL;
      console.log(output);
    });
  }
};
