# Advanced configuration

## Multiple Applications

... TODO mention how to configure and use multiple apps

```js
// config/environment.js
var ENV = {
  firebase: [{
    apiKey: "xyz",
    authDomain: "YOUR-FIREBASE-APP.firebaseapp.com",
    databaseURL: "https://YOUR-FIREBASE-APP.firebaseio.com",
    projectId: "YOUR-FIREBASE-APP",
    storageBucket: "YOUR-FIREBASE-APP.appspot.com",
    messagingSenderId: "00000000000"
  }, {
    apiKey: "xyz",
    authDomain: "ANOTHER-FIREBASE-APP.firebaseapp.com",
    databaseURL: "https://ANOTHER-FIREBASE-APP.firebaseio.com",
    projectId: "ANOTHER-FIREBASE-APP",
    storageBucket: "ANOTHER-FIREBASE-APP.appspot.com",
    messagingSenderId: "00000000000",
    name: 'app-for-auth'
  }]
}
```

`service:firebase-app`, `service:firebase-app-for-auth`

```js
import FirebaseSessionStore from 'emberfire/session-stores/firebase';

export default FirebaseSessionStore.extend({
    firebaseApp: service('firebase-app-for-auth')
});
```

### Run-time configuration

... TODO touch on how to register a new service at runtime

## FirestoreAdapter Options

... TODO talk about settings and enablePersistence

```js
import FirestoreAdapter from 'emberfire/adapters/firestore';

export default FirestoreAdapter.extend({
    enablePersistence: true,
    settings: { timestampsInSnapshots: true }
});
```

## RealtimeDatabaseAdapter Options

... TODO talk about databaseURL

```js
import RealtimeDatabaseAdapter from 'emberfire/adapters/realtime-database';

export default RealtimeDatabaseAdapter.extend({
    databaseURL: 'https://SECOND-DATABSE.firebaseio.com'
});
```