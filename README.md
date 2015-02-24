# EmberFire (Firebase + Ember Data)

[![Build Status](https://travis-ci.org/firebase/emberfire.svg?branch=master)](https://travis-ci.org/firebase/emberfire)
[![Version](https://badge.fury.io/gh/firebase%2Femberfire.svg)](http://badge.fury.io/gh/firebase%2Femberfire)

EmberFire is the officially supported adapter for using
[Firebase](http://www.firebase.com/?utm_medium=web&utm_source=emberfire) with
[Ember Data](https://github.com/emberjs/data).

The `DS.FirebaseAdapter` provides all of the standard `DS.Adapter` methods and will automatically synchronize the store with Firebase. **EmberFire is packaged as an addon with Ember CLI by deafult**, and is also available to use without the CLI. See below for instructions on getting started, and check out the full [EmberFire documentation](https://firebase.com/docs/web/libraries/ember/) on the Firebase website.

**Join the [Firebase + Ember Google Group](https://groups.google.com/forum/#!forum/firebase-ember)
to ask technical questions, share apps you've built, and chat with other developers in the community.**


## Installing EmberFire With the Ember CLI

To install EmberFire as an addon with your Ember CLI app, run the following command within your app's directory:

```bash
$ ember install:addon emberfire
```

This will add emberfire to your `bower.json` file. Then, initialize the `FirebaseAdapter` by running the following command, replacing `YOUR-FIREBASE-NAME` with the URL of your Firebase app:

```bash
$ ember generate firebase-adapter ref:https://YOUR-FIREBASE-NAME.firebaseio.com/
```

This will add your Firebase to your `config/environment.js` file, and it will create your FirebaseAdapter in `app/adapters/application.js`.

Your Firebase data will now be synced with the Ember Data store. For detailed EmberFire documentation, check out the [quickstart](https://firebase.com/docs/web/libraries/ember/quickstart.html) or [guide](https://firebase.com/docs/web/libraries/ember/guide.html) in the Firebase docs.

## Using EmberFire Without Ember CLI

EmberFire also works without ember-cli. We can add EmberFire to an app that doesn't use ember-cli in two steps:

### 1. Include Dependencies

```html
<!-- Ember + Ember Data -->
<script src="http://builds.emberjs.com/tags/v1.9.1/ember.js"></script>
<script src="http://builds.emberjs.com/tags/v1.0.0-beta.12/ember-data.js"></script>

<!-- Firebase -->
<script src="https://cdn.firebase.com/js/client/2.2.1/firebase.js"></script>

<!-- EmberFire -->
<script src="https://cdn.firebase.com/libs/emberfire/2.0.0/emberfire.min.js"></script>
```

Make sure you're using Ember Data beta.11 or above.

You can use the URL above to download both the minified and non-minified versions of EmberFire from the
Firebase CDN. You can also download them from the
[releases page of this GitHub repository](https://github.com/firebase/emberfire/releases).
[Firebase](https://www.firebase.com/docs/web/quickstart.html?utm_medium=web&utm_source=emberfire) and
[Ember](http://emberjs.com/guides/getting-started/obtaining-emberjs-and-dependencies/) can be
downloaded directly from their respective websites.

You can also install EmberFire via Bower and its dependencies will be downloaded automatically:

```bash
$ bower install emberfire --save
```

### 2. Initialize the FirebaseAdapter

After including EmberFire and its dependencies, you can create an instance of `DS.FirebaseAdapter` in your app:

```javascript
App.ApplicationAdapter = DS.FirebaseAdapter.extend({
  firebase: new Firebase('https://YOUR-FIREBASE-NAME.firebaseio.com/')
});
```
Now your Firebase data will be synced directly with the Ember Data store.

## Contributing to EmberFire

If you'd like to contribute to EmberFire, run the following commands to get your environment set up:

### Installation

* `git clone` this repository
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
