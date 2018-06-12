/* eslint-env node */
'use strict';
const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');
const path = require('path');
const writeFile = require('broccoli-file-creator');
const emberfire_version = require('./package.json').version;
const firebase_version = require('firebase').SDK_VERSION;

module.exports = {
  name: 'emberfire',

  included(app) {
    this._super.included.apply(this, arguments);
    this.import('vendor/emberfire/register-versions.js');
  },

  treeForVendor() {
    const content = `Ember.libraries.register('EmberFire', '${emberfire_version}');\nEmber.libraries.register('Firebase', '${firebase_version}');`;
    const registerVersionTree = writeFile(
      'emberfire/register-versions.js',
      content
    );
    return MergeTrees([registerVersionTree]);
  }

};
