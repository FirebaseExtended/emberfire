/* jshint node: true */
module.exports = {
  scenarios: [
    {
      name: 'ember-data-1.13.6',
      dependencies: {
        'ember-data': '1.13.6'
      },
      resolutions: {
        'ember-data': '1.13.6'
      }
    },
    {
      name: 'ember-data-1.13.x',
      dependencies: {
        'ember-data': '^1.13.4'
      },
      resolutions: {
        'ember-data': '^1.13.4'
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
