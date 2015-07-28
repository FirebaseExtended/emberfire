# EmberFire (Firebase + Ember Data)

[![Build Status](https://travis-ci.org/firebase/emberfire.svg?branch=master)](https://travis-ci.org/firebase/emberfire)
[![Version](https://badge.fury.io/gh/firebase%2Femberfire.svg)](http://badge.fury.io/gh/firebase%2Femberfire)
[![Monthly Downloads](http://img.shields.io/npm/dm/emberfire.svg?style=flat)](https://www.npmjs.org/package/emberfire)
[![Ember Observer Score](http://emberobserver.com/badges/emberfire.svg)](http://emberobserver.com/addons/emberfire)

EmberFire is the officially supported adapter for using
[Firebase](http://www.firebase.com/?utm_medium=web&utm_source=emberfire) with
[Ember Data](https://github.com/emberjs/data).

**IMPORTANT NOTICE:** *If you require embedded records, there is a [bug](https://github.com/emberjs/data/issues/3549) in Ember Data that prevents them from working in `1.13.0 - 1.13.5`, you will need to use `1.13.6` or higher*

**Join the [Firebase + Ember Google Group](https://groups.google.com/forum/#!forum/firebase-ember)
to ask technical questions, share apps you've built, and chat with other developers in the community.**

## Compatibility

Please consult this table when selecting your version of EmberFire:

| Ember Data        | EmberFire |
| ------------------| ----------|
| beta.12 - beta.18 | 1.4.x     |
| beta.19           | none      |
| 1.13+             | 1.5.x     |
| canary            | master    |

*To install the `master` branch, use `ember install firebase/emberfire#master`*

## Installation

To install EmberFire as an addon with ember-cli, run the following command within your app's directory:

```bash
$ ember install emberfire
```

This will create a `app/adapters/application.js`. All you need to do is update your Firebase database url in `config/environment.js`:

```js
// config/environment.js
  var ENV = {
    // ...
    firebase: 'https://YOUR-FIREBASE-NAME.firebaseio.com/',
    // ...
```

Your Firebase data will now be synced with the Ember Data store. For detailed EmberFire documentation, check out the [quickstart](https://firebase.com/docs/web/libraries/ember/quickstart.html) or [guide](https://firebase.com/docs/web/libraries/ember/guide.html) in the Firebase docs.

## Using EmberFire without ember-cli

EmberFire also works without ember-cli. See the [Firebase documentation](https://firebase.com/docs/web/libraries/ember/guide.html#section-without-ember-cli) for instructions on getting started.

## Contributing to EmberFire

If you'd like to contribute to EmberFire, run the following commands to get your environment set up:

### Setup

* `git clone` this repository
* `npm install -g ember-cli bower gulp`
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

* `ember try <scenario>` where  `<scenario>` is one of the scenarios in `config/ember-try.js`

Example:

```
ember try ember-data-canary
```

### Running the FireBlog demo app

* `ember server`
* Visit your app at http://localhost:4200.
