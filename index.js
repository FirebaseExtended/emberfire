/* eslint-env node */
'use strict';

module.exports = {
  name: 'emberfire',

  included(app) {
    this._super.included.apply(this, arguments);

    app.import('node_modules/firebase/firebase.js');
    app.import('vendor/shims/firebase.js');
  }
};
