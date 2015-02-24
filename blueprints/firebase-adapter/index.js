var inflection = require('inflection');

module.exports = {
  description: 'Generates a firebase adapter.',

  locals: function(options) {
    var firebaseUrl     = 'config.firebase';
    var adapterName     = options.entity.name;
    var baseClass       = 'FirebaseAdapter';

    if (adapterName !== 'application') {
      firebaseUrl = "config.firebase + '/" + inflection.pluralize(adapterName) + "'";
    }

    return {
      baseClass: baseClass,
      firebaseUrl: firebaseUrl
    };
  }
};
