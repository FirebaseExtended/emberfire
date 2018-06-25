/* eslint-env node */
const RSVP = require('rsvp');

module.exports = {
  description: '',

  // locals(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  afterInstall(options) {
    return RSVP.all([
      this.addPackageToProject('firebase', '^5.1.0'),
      this.addPackageToProject('emberfire', '^3.0.0'),
      this.addAddonToProject('ember-auto-import', '^1.0.0')
    ]);
  }
};
