module.exports = {
  scenarios: [
    {
      name: 'default',
      dependencies: { }
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
