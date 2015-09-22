/* jshint node: true */
module.exports = {
  scenarios: [
    {
      name: 'ember-data-1.13.x',
      dependencies: {
        'ember-data': '^1.13.11'
      },
      resolutions: {
        'ember-data': '^1.13.11'
      }
    },
    {
      name: 'ember-data-2.0.x',
      dependencies: {
        'ember-data': '^2.0.0'
      },
      resolutions: {
        'ember-data': '^2.0.0'
      }
    },
    {
      name: 'ember-data-canary',
      dependencies: {
        'ember-data': 'components/ember-data#canary'
      },
      resolutions: {
        'ember-data': 'canary'
      }
    }
  ]
};
