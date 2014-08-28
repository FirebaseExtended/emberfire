'use strict';

var path = require('path');
var fs   = require('fs');
var bowerPath = require('bower-config').read().directory;

function EmberCLIEmberFire(project) {
  this.project = project;
  this.name    = 'Ember CLI EmberFire';
}

function unwatchedTree(dir) {
  return {
    read:    function() { return dir; },
    cleanup: function() { }
  };
}

EmberCLIEmberFire.prototype.treeFor = function treeFor(name) {
  var treePath =  path.join('node_modules', 'emberFire', name);

  if (!this.emberFireIncluded) {
    this.app.import(bowerPath + '/emberfire/dist/emberfire.js');
    this.emberFireIncluded = true;
  }

  if (fs.existsSync(treePath)) {

    return unwatchedTree(treePath);
  }
};

EmberCLIEmberFire.prototype.included = function included(app) {
  this.app = app;

  this.app.import(bowerPath + '/firebase/firebase.js');
};

module.exports = EmberCLIEmberFire;
