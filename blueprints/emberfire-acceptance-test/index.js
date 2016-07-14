/*jshint node:true*/

var path = require('path');

var mochaBlueprint = require('ember-cli-mocha/blueprints/acceptance-test');
var acceptanceBlueprint = require('ember-cli/blueprints/acceptance-test');

var isMochaProject = function(project) {
  if (project && project.addons) {
    return project.addons.map((addon) => addon.name).indexOf('ember-cli-mocha') !== -1;
  }
};

var emberfireAcceptanceBlueprint = {
  description: 'Generates an acceptance test for a Firebase backed feature.',

  locals: function() {
    blueprint = isMochaProject(this.project) ? mochaBlueprint : acceptanceBlueprint;
    return blueprint.locals.apply(this, arguments)
  },

  filesPath: function() {
    var blueprintPath = 'qunit-files';

    if (isMochaProject(this.project)) {
      blueprintPath = 'mocha-files';
    }

    return(path.join(this.path, blueprintPath));
  }
};

module.exports = Object.assign({}, acceptanceBlueprint, mochaBlueprint, emberfireAcceptanceBlueprint);
