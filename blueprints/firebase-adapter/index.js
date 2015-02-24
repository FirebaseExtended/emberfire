var inflection = require('inflection');

module.exports = {
  description: 'Generates an firebase adapter.',

  locals: function(options) {
    var firebaseUrl     = 'config.firebase';
    var adapterName     = options.entity.name;
    var baseClass       = 'FirebaseAdapter';
    var importStatements =
      'import config from \'../config/environment\';\n' +
      'import Firebase from \'firebase\';\n' +
      'import FirebaseAdapter from \'emberfire/adapters/firebase\';'

    if (adapterName !== 'application') {
      firebaseUrl = "config.firebase + '/" + inflection.pluralize(adapterName) + "'";
    }

    return {
      importStatements: importStatements,
      baseClass: baseClass,
      firebaseUrl: firebaseUrl
    };
  }
};
