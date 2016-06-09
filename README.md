# EmberFire (Firebase + Ember Data)

[![Build Status](https://travis-ci.org/firebase/emberfire.svg?branch=master)](https://travis-ci.org/firebase/emberfire)
[![Version](https://badge.fury.io/gh/firebase%2Femberfire.svg)](http://badge.fury.io/gh/firebase%2Femberfire)
[![Monthly Downloads](http://img.shields.io/npm/dm/emberfire.svg?style=flat)](https://www.npmjs.org/package/emberfire)
[![Ember Observer Score](http://emberobserver.com/badges/emberfire.svg)](http://emberobserver.com/addons/emberfire)

EmberFire is the officially supported adapter for using
[Firebase](http://www.firebase.com/?utm_medium=web&utm_source=emberfire) with
[Ember Data](https://github.com/emberjs/data).

**Join the [Firebase + Ember Google Group](https://groups.google.com/forum/#!forum/firebase-ember)
to ask technical questions, share apps you've built, and chat with other developers in the community.**

## Compatibility

Please consult this table when selecting your version of EmberFire and Firebase:

| Ember Data        | EmberFire | Firebase SDK |
| ------------------| ----------|--------------|
| beta.12 - beta.18 | 1.4.x     | 2.x          |
| beta.19           | none      | 2.x          |
| 1.13+             | 1.5.x     | 2.x          |
| 2.0 - 2.2         | 1.6.x     | 2.x          |
| 2.3+              | 2.0.x     | 3.x          |
| canary            | master    | 3.x          |

*To install the `master` branch, use `ember install firebase/emberfire#master`*

## Installation

To install EmberFire as an addon with ember-cli, run the following command within your app's directory:

```bash
$ ember install emberfire
```

This will create a `app/adapters/application.js`. All you need to do is update your Firebase property in `config/environment.js` with the initializeApp config found on [the Firebase console](https://console.firebase.google.com/) (select your project and click [Add Firebase to your web app] on the overview page):

```js
// config/environment.js
var ENV = {
  firebase: {
    apiKey: 'xyz',
    authDomain: 'YOUR-FIREBASE-APP.firebaseapp.com',
    databaseURL: 'https://YOUR-FIREBASE-APP.firebaseio.com',
    storageBucket: 'YOUR-FIREBASE-APP.appspot.com',
  },
  // if using ember-cli-content-security-policy
  contentSecurityPolicy: {
    'script-src': '\'self\' \'unsafe-eval\' apis.google.com',
    'frame-src': '\'self\' https://*.firebaseapp.com',
    'connect-src': '\'self\' wss://*.firebaseio.com https://*.googleapis.com'
  },
```

Your Firebase data will now be synced with the Ember Data store. For detailed EmberFire documentation, check out the [quickstart](https://firebase.com/docs/web/libraries/ember/quickstart.html) or [guide](https://firebase.com/docs/web/libraries/ember/guide.html) in the Firebase docs.

### Nested Addon Usage Caveat

To publish an addon that exports functionality driven by EmberFire,
note that EmberFire must be listed in the `dependencies` for NPM
and not the `devDependencies`.

When consuming an addon that consumes EmberFire, running the
initializing generator by hand is required.

```sh
ember generate ../node_modules/your-addon/node_modules/emberfire/blueprints/emberfire
```


## Using EmberFire without ember-cli

EmberFire also works without ember-cli. See the [Firebase documentation](https://firebase.com/docs/web/libraries/ember/guide.html#section-without-ember-cli) for instructions on getting started.

## Contributing to EmberFire

If you'd like to contribute to EmberFire, run the following commands to get your environment set up:

### Setup

* `git clone` this repository
* `npm install -g ember-cli bower gulp phantomjs`
* `npm install`
* `bower install`

### Using your local EmberFire workdir in another local project

From your `emberfire` workdir

* `npm link`
* `npm prune --production` (removes dev dependencies, these can trip you up!)

From your *app* workdir

* `npm link emberfire`
* Update your `package.json` so that `emberfire` is in `devDependencies` and is set to version `0.0.0`

  ```
  "devDependencies": {
    "emberfire": "0.0.0"
  ```

### Running tests

* `ember test` OR
* `ember test --server`

##### Running tests against a specific version of ember-data

* `ember try:one <scenario>` where  `<scenario>` is one of the scenarios in `config/ember-try.js`

Example:

```
ember try:one ember-data-canary
```

### Running the FireBlog demo app

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).
