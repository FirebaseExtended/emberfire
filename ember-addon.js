var path = require('path');

module.exports = {
  name: 'emberfire',
  included: function(app) {
    app.import('vendor/emberfire.js');
    app.import(app.bowerDirectory + '/firebase/firebase.js');
  },
  treeFor: function(key) {
    if (key === 'vendor') {
      return path.join(__dirname, 'dist');
    }
  },
  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints');
  },
  afterInstall: function() {
    return this.addBowerPackageToProject('firebase', '^1.0.0');
  }
};
