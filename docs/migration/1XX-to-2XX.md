# Migrating from EmberFire `1.x.x` to `2.x.x`

This migration document covers all the major breaking changes mentioned in the [EmberFire `2.0.0`
change log](https://github.com/firebase/emberfire/releases/tag/v2.0.0).


## Upgrade to the Firebase `3.x.x` SDK

Ensure you're using a `3.x.x` version of the Firebase SDK in your project. Version `2.x.x` of the
Firebase SDK is no longer supported with EmberFire version `2.x.x`.

| SDK Version | EmberFire Version Supported |
|-------------|-------------------------------|
| 3.x.x | 2.x.x |
| 2.x.x | 1.x.x |

Consult the Firebase [web / Node.js migration guide](https://firebase.google.com/support/guides/firebase-web)
for more details on what has changed in the Firebase `3.x.x` SDK.

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


## Torii auth response payload changes

Although the Torii authentication interface remains the same, the payload returned will differ slightly. The new `payload.currentUser` returns a [firebase.User](https://firebase.google.com/docs/reference/js/firebase.User) object.

Please familiarize yourself with the changes to Firebase Authentication in the [Firebase Authentication guide](https://firebase.google.com/docs/auth/).

Opening sessions **remains the same**:

```js
this.get('session').open('firebase', {provider: 'twitter'}).then((result) => {
});
```

However, the resulting payload differs:

Before:

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

After:

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
