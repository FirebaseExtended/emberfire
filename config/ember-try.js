/* jshint node: true */
module.exports = {
  scenarios: [
    {
      name: 'ember-data-release',
      npm: {
        devDependencies: {
          'ember-data': 'emberjs/data#release'
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
