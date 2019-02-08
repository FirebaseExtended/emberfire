# Integrating Firebase

Using Firebase, developers can add a realtime backend to their Ember app without setting up a server. Firebase's Ember library EmberFire integrates directly with Ember Data, so all of the data for your app is automatically persisted.

Tom Dale, one of the creators of Ember, explains:

> With first-class support for Ember.js, Firebase developers can continue pushing the boundaries of what's possible in the browser by leaning on the strong architectural features of Ember that lead your app towards clean separation of concerns.
TOM DALE, CO-CREATOR OF EMBERJS

Firebase's realtime data synchronization is a great fit with Ember's frontend philosophy. Using EmberFire, we can interact with Ember Data as we normally would, and our app's data will automatically be persisted. Adding EmberFire to your `ember-cli` app is simple.


## 1. Install emberfire as an ember-cli addon

In order to use EmberFire in our project, we can run the following in our ember-cli app's directory:

```
$ ember install emberfire
```

This will add Firebase to your `package.json` file and generate `app/adapters/application.js` for you with the following content:


```js
// app/adapters/application.js
import FirestoreAdapter from 'emberfire/adapters/firestore';

export default FirestoreAdapter.extend({
  // Uncomment the following lines to enable offline persistence and multi-tab support
  // enablePersistence: true,
  // persistenceSettings: { experimentalTabSynchronization: true }
});
```

If you prefer to use the Firebase Realtime Database, you can run the following command `$ ember generate realtime-database-adapter`.

## 2. Configure Firebase

We'll build a blogging app to demonstrate how to store and sync data with EmberFire. Full code for this app is available on GitHub.

First we need to add our Firebase configuration to our `environment.js`:

```js
// config/environment.js
var ENV = {
  firebase: {
    apiKey: "xyz",
    authDomain: "YOUR-FIREBASE-APP.firebaseapp.com",
    databaseURL: "https://YOUR-FIREBASE-APP.firebaseio.com",
    projectId: "YOUR-FIREBASE-APP",
    storageBucket: "YOUR-FIREBASE-APP.appspot.com",
    messagingSenderId: "00000000000"
  }
```

Get these values from the [Firebase Console](https://console.firebase.google.com/) by clicking the **[Add Firebase to your web app]** button on the project overview page.

You are now set up to use Ember Data as you normally would.


### Continue reading

1. **Installation**
1. [User Authentication](authentication.md)
1. [Saving and Retrieving Data](saving-and-retrieving-data.md)
1. [Querying Data](querying-data.md)
1. [Relationships](relationships.md)
1. [Security Rules](security-rules.md)
1. [Deploying to Firebase Hosting](deploying-to-firebase-hosting.md)
1. [Fastboot support](fastboot-support.md)
1. [Deploying to Cloud Functions for Firebase](deploying-fastboot-to-cloud-functions.md)