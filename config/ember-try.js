/* jshint node: true */
module.exports = {
  scenarios: [
    {
      name: 'ember-data-2.5.x',
      npm: {
        devDependencies: {
          'ember-data': '~2.5.0'
        }
      }
    },
    {
      name: 'ember-data-2.6.x',
      npm: {
        devDependencies: {
          'ember-data': '~2.6.0'
        }
      }
    },
    {
      name: 'ember-data-2.7.x',
      npm: {
        devDependencies: {
          'ember-data': '~2.7.0'
        }
      }
    },
    {
      name: 'ember-data-2.8.x',
      npm: {
        devDependencies: {
          'ember-data': '~2.8.0'
        }
      }
    },
    {
      name: 'ember-data-beta',
      bower: {
        dependencies: {
          'ember-data': 'components/ember-data#beta'
        },
        resolutions: {
          'ember-data': 'components/ember-data#beta'
        }
      }
    },
    {
      name: 'ember-data-canary',
      bower: {
        dependencies: {
          'ember-data': 'components/ember-data#canary'
        },
        resolutions: {
          'ember-data': 'components/ember-data#canary'
        }
      }
    }
  ]
};
