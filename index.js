/* jshint node: true */
'use strict';

var path = require('path');
var resolve = require('resolve');
var Webpack = require('broccoli-webpack');
var mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'emberfire',

  included: function included(app) {
    this._super.included(app);

    // make sure app is correctly assigned when being used as a nested addon
    if (app.app) {
      app = app.app;
    }
    this.app = app;

    this.app.import('vendor/firebase.amd.js');
  },

  treeForVendor: function(tree) {
    var trees = [];

    trees.push(new Webpack([
      path.dirname(require.resolve('firebase'))
    ], {
      entry: './firebase-browser.js',
      output: {
        library: 'firebase',
        libraryTarget: 'amd',
        filename: 'firebase.amd.js'
      }
    }));

    if (tree) {
      trees.push(tree);
    }

    return mergeTrees(trees, { overwrite: true });
  }
};
