/* eslint-env node */
const RSVP = require('rsvp');

module.exports = {
  normalizeEntityName() {},
  description: 'Add emberfire dependencies',
  afterInstall(options) {
    return RSVP.all([
      this.addPackageToProject('firebase', '^7.0.0'),
      this.addAddonToProject('ember-auto-import', '^1.5.2')
    ]);
  }
};
