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

  afterInstall: function() {
    var g = chalk.green;
    var y = chalk.yellow;
    var b = chalk.blue;
    var m = chalk.magenta;
    var r = chalk.red;
    var out = EOL;

    out += y('EmberFire') + ' installed.' + EOL +
        EOL +
        r('CONFIGURATION REQUIRED') + EOL +
        EOL +
        'Please update ' + b('config/environment.js') +
        ' with your firebase settings. You can find these at ' +
        'https://console.firebase.google.com/ by clicking the ' +
        m('[Add Firebase to your web app]') + ' button on the project overview panel.' +
        EOL + EOL;


    out += "Example:" + EOL +
        EOL +
        g("// config/environment.js") + EOL +
        "var ENV = {" + EOL +
        "  locationType: 'auto'," + EOL +
        g("  // ...") + EOL +
        "  firebase: {" + EOL +
        "    apiKey: 'xyz'," + EOL +
        "    authDomain: 'YOUR-FIREBASE-APP.firebaseapp.com'," + EOL +
        "    databaseURL: 'https://YOUR-FIREBASE-APP.firebaseio.com'," + EOL +
        "    storageBucket: 'YOUR-FIREBASE-APP.appspot.com'," + EOL +
        "  }," + EOL +
        EOL +
        EOL +
        g("  // if using ember-cli-content-security-policy") + EOL +
        "  contentSecurityPolicy: {" + EOL +
        "    'script-src': \"'self' 'unsafe-eval' apis.google.com\"," + EOL +
        "    'frame-src': \"'self' https://*.firebaseapp.com\"," + EOL +
        "    'connect-src': \"'self' wss://*.firebaseio.com https://*.googleapis.com\"" + EOL +
        "  }," + EOL +
        EOL;

    this.ui.writeLine(out);
  }
};
