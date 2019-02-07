/* eslint-env node */

const getURLFor = require('ember-source-channel-url');

module.exports = () => Promise.all(
  ['release', 'beta', 'canary'].map(getURLFor)
).then( ([releaseUrl, betaUrl, canaryUrl]) =>
  ({
    npmOptions: ['--loglevel=silent', '--no-shrinkwrap=true'],
    scenarios: [{
      name: 'ember-lts-2.16',
      npm: {
        devDependencies: {
          'ember-source': '~2.16.0',
          'ember-data': '~2.16.0'
        }
      }
    }, {
      name: 'ember-lts-2.18',
      npm: {
        devDependencies: {
          'ember-source': '~2.18.0',
          'ember-data': '~2.18.0'
        }
      }
    }, {
      name: 'ember-lts-3.4',
      npm: {
        devDependencies: {
          'ember-source': '~3.4.0',
          'ember-data': '~3.4.0'
        }
      }
    }, {
      name: 'ember-release',
      npm: {
        devDependencies: {
          'ember-source': releaseUrl,
          'ember-data': 'emberjs/data#release'
        }
      }
    }, {
      name: 'ember-beta',
      npm: {
        devDependencies: {
          'ember-source': betaUrl,
          'ember-data': 'emberjs/data#beta'
        }
      }
    }, {
      name: 'ember-canary',
      npm: {
        devDependencies: {
          'ember-source': canaryUrl,
          'ember-data': 'emberjs/data#master'
        }
      }
    }, {
      name: 'ember-default',
      npm: {
        devDependencies: {}
      }
    }, {
      name: 'firebase-latest',
      npm: {
        dependencies: {
          'firebase': 'latest'
        }
      }
    }, {
      name: 'firebase-next',
      npm: {
        dependencies: {
          'firebase@next': 'latest'
        }
      }
    }, {
      name: 'firebase-canary',
      npm: {
        dependencies: {
          'firebase@canary': 'latest'
        }
      }
    }]
  })
)