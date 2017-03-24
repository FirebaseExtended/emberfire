/* jshint node: true */
module.exports = {
  scenarios: [
    {
      name: 'ember-data-2.8.x',
      npm: {
        devDependencies: {
          'ember-data': '~2.8.0'
        }
      }
    },
    {
      name: 'ember-data-2.9.x',
      npm: {
        devDependencies: {
          'ember-data': '~2.9.0'
        }
      }
    },
    {
      name: 'ember-data-2.10.x',
      npm: {
        devDependencies: {
          'ember-data': '~2.10.0'
        }
      }
    },
    {
      name: 'ember-data-2.11.x',
      npm: {
        devDependencies: {
          'ember-data': '~2.11.0'
        }
      }
    },
    {
      name: 'ember-data-2.12.x',
      npm: {
        devDependencies: {
          'ember-data': '~2.12.0'
        }
      }
    },
    {
      name: 'ember-data-beta',
      npm: {
        devDependencies: {
          'ember-data': 'emberjs/data#beta'
        }
      }
    },
    {
      name: 'ember-data-canary',
      npm: {
        devDependencies: {
          'ember-data': 'emberjs/data#master'
        }
      }
    }
  ]
};
