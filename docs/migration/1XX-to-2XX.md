# Migrating from EmberFire `1.x.x` to `2.x.x`

This migration document covers all the major breaking changes mentioned in the [EmberFire `2.0.0`
change log](https://github.com/firebase/emberfire/releases/tag/v2.0.0).

Install the 2.0 version of emberfire:

```
ember install emberfire@2.0.0
```

## Upgrade to the Firebase `3.x.x` SDK

Ensure you're using a `3.x.x` version of the Firebase SDK in your `bower.json`.

```
  "dependencies": {
    "ember": "~2.5.0",
    "ember-cli-shims": "0.1.1",
    "ember-cli-test-loader": "0.2.2",
    "ember-qunit-notifications": "0.1.0",
    "firebase": "^3.0.0"
  }
}
```

Version `2.x.x` of the Firebase SDK is no longer supported with EmberFire version `2.x.x`.

| SDK Version | EmberFire Version Supported |
|-------------|-------------------------------|
| 3.x.x | 2.x.x |
| 2.x.x | 1.x.x |

Consult the Firebase [web / Node.js migration guide](https://firebase.google.com/support/guides/firebase-web)
for more details on what has changed in the Firebase `3.x.x` SDK.

## PhantomJS compatibility

Firebase 3.0 SDK does not yet work in PhantomJS 1.x or 2.x. For `ember-cli` Update your `testem.js` file to replace `PhantomJS` in the `launch_in_ci` block with a true browser like Chrome or Firefox. Firefox works in Travis. Chrome is available via the name `Chromium`, but doesn't appear to work.

```js
// testem.js
  module.exports = {
  // ...
  "launch_in_ci": [
    "Firefox"
  ],
```

## New configuration format

Use the new firebase 3.0 SDK `initializeApp` config format in `config/environment.js`

Before:

```js
// config/environment.js
var ENV = {
  firebase: 'https://YOUR-FIREBASE-APP.firebaseio.com',
```

After:

```js
// config/environment.js
var ENV = {
  firebase: {
    apiKey: 'xyz',
    authDomain: 'YOUR-FIREBASE-APP.firebaseapp.com',
    databaseURL: 'https://YOUR-FIREBASE-APP.firebaseio.com',
    storageBucket: 'YOUR-FIREBASE-APP.appspot.com',
  },
```

You can find these details by selecting a project in the [Firebase Console](https://console.firebase.google.com/) and clicking **[Add Firebase to your web app]** on the overview page.

## Remove `firebase` property from your adapters:

FirebaseAdapter now automatically picks up the base Firebase db reference from the `firebase` service. You should remove any overrides in your adapters, especially in `adapters/application.js`.

Before:

```js
// adapters/application.js
import Ember from 'ember';
import FirebaseAdapter from 'emberfire/adapters/firebase';

export default FirebaseAdapter.extend({
  firebase: Ember.inject.service(),
  // OR
  firebase: new Firebase('<some url>'),
});
```


After:

```js
// adapters/application.js
import FirebaseAdapter from 'emberfire/adapters/firebase';

export default FirebaseAdapter.extend({
});
```

If you need per-type adapter overrides, for example you want to use a different firebase DB entirely for a specific model, you can still override the `firebase` property when extending the adapter.


## Torii auth response payload changes

Although the Torii authentication interface remains the same, the payload returned will differ slightly. The payload's `currentUser` is now a [firebase.User](https://firebase.google.com/docs/reference/js/firebase.User) object.

Please familiarize yourself with the changes to Firebase Authentication in the [Firebase Authentication guide](https://firebase.google.com/docs/auth/).

Opening sessions **remains the same**:

```js
this.get('session').open('firebase', {provider: 'twitter'}).then((result) => {
});
```

Payload before:

```js
let result = {
  provider: 'twitter',
  uid: '2425352',
  currentUser: {
    uid: '2425352',
    email: 'email@email.com',
    displayName: 'Tim'
  }
}
```

Payload after:

```js
let result = {
  provider: 'twitter.com', // provider strings changed
  uid: '2425352',
  // now returns a firebase.User
  currentUser: {
    uid: '2425352',
    email: 'email@email.com',
    emailVerified: true,
    isAnonymous: false,
    refreshToken: '234234',
    // ...
  }
}
```

## Update auth methods

The new SDK [changed a number of authentication methods](https://firebase.google.com/docs/reference/js/firebase.auth.Auth). They have been updated to use promise interfaces and are located on the `firebaseApp.auth()` object.

Before:

```js
firebase: Ember.inject.service(),

actions: {
  createUser(email, pass) {
    const ref = this.get('firebase');
    ref.createUser({email: email, password: pass), (err, authData) => {
      if (!err) {
        const user = this.store.createRecord('user', {
          id: authData.uid,
          email: authData.email
        });
        user.save();
      }
    });
  }
}
```

After:

```js
firebaseApp: Ember.inject.service(),

actions: {
  createUser(email, pass) {
    const auth = this.get('firebaseApp').auth();
    auth.createUserWithEmailAndPassword(email, pass).then((userResponse) => {
      const user = this.store.createRecord('user', {
        id: userResponse.uid,
        email: userResponse.email
      });
      return user.save();
    });
  }
}
```
