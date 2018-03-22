/* eslint-env node */

const getURLFor = require('ember-source-channel-url');

module.exports = () => Promise.all(
  ['release', 'beta', 'canary'].map(getURLFor)
).then( ([releaseUrl, betaUrl, canaryUrl]) =>
  ({
    useYarn: true,
    scenarios: [{
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
          'ember-data': 'emberjs/data#canary'
        }
      }
    }, {
      name: 'ember-default',
      npm: {
        devDependencies: {}
      }
    }]
  })
)