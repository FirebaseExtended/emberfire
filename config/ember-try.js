module.exports = {
  scenarios: [
    {
      name: 'ember-data-beta.12',
      dependencies: {
        'ember-data': '1.0.0-beta.12'
      },
      resolutions: {
        'ember-data': '1.0.0-beta.12'
      }
    },
    {
      name: 'ember-data-beta.14.1',
      dependencies: {
        'ember-data': '1.0.0-beta.14.1'
      },
      resolutions: {
        'ember-data': '1.0.0-beta.14.1'
      }
    },
    {
      name: 'ember-data-beta.16.1',
      dependencies: {
        'ember-data': '1.0.0-beta.16.1'
      },
      resolutions: {
        'ember-data': '1.0.0-beta.16.1'
      }
    },
    {
      name: 'ember-data-beta.17',
      dependencies: {
        'ember-data': '1.0.0-beta.17'
      },
      resolutions: {
        'ember-data': '1.0.0-beta.17'
      }
    },
    {
      name: 'ember-data-release',
      dependencies: {
        'ember-data': 'components/ember-data#release'
      },
      resolutions: {
        'ember-data': 'release'
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
