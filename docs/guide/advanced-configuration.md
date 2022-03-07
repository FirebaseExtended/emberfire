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
import { inject as service } from '@ember/service';

export default class FirebaseSessionStoreSession extends FirebaseSessionStore {
    @service('firebase-app-for-auth') firebaseApp;
}
```

### Run-time configuration

... TODO touch on how to register a new service at runtime

## FirestoreAdapter Options

... TODO talk about settings and enablePersistence

```js
import FirestoreAdapter from 'emberfire/adapters/firestore';

export default class ApplicationAdapter extends FirestoreAdapter {
    enablePersistence = true;
    settings = { timestampsInSnapshots: true };
};
```

## RealtimeDatabaseAdapter Options

... TODO talk about databaseURL

```js
import RealtimeDatabaseAdapter from 'emberfire/adapters/realtime-database';

export default class ApplicationAdapter extends RealtimeDatabaseAdapter {
    databaseURL = 'https://SECOND-DATABSE.firebaseio.com'
};
```