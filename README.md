# EmberFire (Firebase + Ember Data)

[![Build Status](https://travis-ci.org/firebase/emberfire.svg?branch=master)](https://travis-ci.org/firebase/emberfire)
[![Version](https://badge.fury.io/gh/firebase%2Femberfire.svg)](http://badge.fury.io/gh/firebase%2Femberfire)

EmberFire is the officially supported adapter for using
[Firebase](http://www.firebase.com/?utm_medium=web&utm_source=emberfire) with
[Ember Data](https://github.com/emberjs/data).

The `FirebaseAdapter` provides all of the standard `DS.Adapter` methods and will automatically synchronize the store with Firebase. **EmberFire is packaged as an addon with Ember CLI by deafult**, and is also available to use without the CLI. See below for instructions on getting started, and check out the full [EmberFire documentation](https://firebase.com/docs/web/libraries/ember/) on the Firebase website. EmberFire works with Ember Data beta.11 through beta.14.1 (and beta.15 but with deprecation warnings).

**Join the [Firebase + Ember Google Group](https://groups.google.com/forum/#!forum/firebase-ember)
to ask technical questions, share apps you've built, and chat with other developers in the community.**


## Installing EmberFire With the Ember CLI

To install EmberFire as an addon with your Ember CLI app, run the following command within your app's directory:

```bash
$ ember install:addon emberfire
```

This will add Firebase as a dependency in your `bower.json` file and create `app/adapters/application.js`. Then, add your firebase url to your `config/environment.js`:

```js
// config/environment.js
module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'firebase-app',
    environment: environment,
    firebase: 'https://YOUR-FIREBASE-NAME.firebaseio.com/',
    baseURL: '/',
    ...
```

Your Firebase data will now be synced with the Ember Data store. For detailed EmberFire documentation, check out the [quickstart](https://firebase.com/docs/web/libraries/ember/quickstart.html) or [guide](https://firebase.com/docs/web/libraries/ember/guide.html) in the Firebase docs.

## Using EmberFire Without Ember CLI

EmberFire also works without ember-cli. See the [Firebase documentation](https://firebase.com/docs/web/libraries/ember/guide.html#section-without-ember-cli) for instructions on getting started.

## Contributing to EmberFire

If you'd like to contribute to EmberFire, run the following commands to get your environment set up:

### Installation

* `git clone` this repository
* `npm install -g ember-cli bower`
* `npm install`
* `bower install`

### Running

* `ember server`
* Visit your app at http://localhost:4200.

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build`
