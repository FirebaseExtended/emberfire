/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  /*
    This build file specifes the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */
  app.import('bower_components/normalize-css/normalize.css');
  app.import('bower_components/moment/moment.js');
  app.import('bower_components/blueimp-md5/js/md5.js');
  app.import('vendor/markdown/markdown.js');

  app.import('bower_components/sinon/index.js', {
    type: 'test'
  });

  app.import('vendor/sinon/shim.js', {
    type: 'test',
    exports: {
      'sinon': [
        'default'
      ]
    }
  });

  app.import('bower_components/mockfirebase/browser/mockfirebase.js', {
    type: 'test'
  });

  app.import('vendor/mockfirebase/shim.js', {
    type: 'test',
    exports: {
      'mockfirebase': [
        'default'
      ]
    }
  });

  return app.toTree();
};
