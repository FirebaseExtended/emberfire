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
      this.addAddonToProject('firebase'),
      this.addPackageToProject('emberfire'),
      this.addAddonToProject('ember-auto-import')
    ]);
  }
};
