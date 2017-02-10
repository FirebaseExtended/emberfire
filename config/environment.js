/*jshint node:true*/
'use strict';

var version = require('../package.json').version;

module.exports = function(environment /*, appConfig */) {
  return {
    EMBERFIRE_VERSION: version
  };
};
