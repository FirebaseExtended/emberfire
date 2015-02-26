/* jshint node: true */
/* global require, module */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

var app = new EmberAddon();

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
    'mock-firebase': [
      'default'
    ]
  }
});

module.exports = app.toTree();
