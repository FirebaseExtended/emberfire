/*jshint node:true*/
/* global require, module */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    // Add options here
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */
  app.import('bower_components/normalize-css/normalize.css');
  app.import('bower_components/moment/moment.js');

  app.import('bower_components/blueimp-md5/js/md5.js');
  app.import('vendor/markdown/markdown.js');

  return app.toTree();
};
