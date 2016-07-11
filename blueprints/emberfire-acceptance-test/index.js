/*jshint node:true*/

var path = require('path');

var acceptanceBlueprint;

try {
  acceptanceBlueprint = require('ember-cli-mocha/blueprints/acceptance-test');
} catch(e) {
  acceptanceBlueprint = require('ember-cli/blueprints/acceptance-test');
}

var emberfireAcceptanceBlueprint = {
  description: 'Generates an acceptance test for a Firebase backed feature.',

  filesPath: function() {
    var blueprintPath = 'qunit-files';

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
