/* eslint-env node */
'use strict';

module.exports = {
  name: 'emberfire',
  included(app) {
    this._super.included.apply(this, arguments);
  }
};
