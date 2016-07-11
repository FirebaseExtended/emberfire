/*jshint node:true*/

var acceptanceBlueprint = require('ember-cli/blueprints/acceptance-test');
var mochaDefined = require('../')
var path = require('path');

var emberfireAcceptanceBlueprint = {
  description: 'Generates an acceptance test for a Firebase backed feature.',

  filesPath() {
    var blueprintPath = 'qunit-files';

    // console.log(this.project);
    if (this.project && this.project.addons) {
      var addonNames = this.project.addons.map(function(addon) {
        return addon.name;
      });

      if (addonNames.indexOf('ember-cli-mocha') === -1) {
        blueprintPath = 'mocha-files';
      }
    }
    return(path.join(this.path, blueprintPath));
  }
};

module.exports = Object.assign({}, acceptanceBlueprint, emberfireAcceptanceBlueprint);
