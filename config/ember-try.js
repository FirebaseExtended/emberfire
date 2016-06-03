/* jshint node: true */
module.exports = {
  scenarios: [
    {
      name: 'ember-data-2.3.x',
      npm: {
        devDependencies: {
          'ember-data': '~2.3.0'
        }
      }
    },
    {
      name: 'ember-data-2.4.x',
      npm: {
        devDependencies: {
          'ember-data': '~2.4.0'
        }
      }
    },
    {
      name: 'ember-data-2.5.x',
      npm: {
        devDependencies: {
          'ember-data': '~2.5.0'
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
