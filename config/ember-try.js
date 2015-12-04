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
        'ember-data': '2.0.x'
      },
      resolutions: {
        'ember-data': '2.0.x'
      }
    },
    {
      name: 'ember-data-2.1.x',
      dependencies: {
        'ember-data': '2.1.x'
      },
      resolutions: {
        'ember-data': '2.1.x'
      }
    },
    {
      name: 'ember-data-2.2.x',
      dependencies: {
        'ember-data': '2.2.x'
      },
      resolutions: {
        'ember-data': '2.2.x'
      }
    },
    {
      name: 'ember-data-beta',
      dependencies: {
        'ember-data': 'components/ember-data#beta'
      },
      resolutions: {
        'ember-data': 'beta'
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
