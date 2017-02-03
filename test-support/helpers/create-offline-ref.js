import firebase from 'firebase';

/**
 * Creates an offline firebase reference with optional initial data and url.
 *
 * Be sure to `stubfirebase()` and `unstubfirebase()` in your tests!
 *
 * @param  {!Object} [initialData]
 * @param  {string} [url]
 * @param  {string} [apiKey]
 * @return {!firebase.database.Reference}
 */
export default function createOfflineRef(initialData,
    url = 'https://emberfire-tests-2c814.firebaseio.com',
    apiKey = 'AIzaSyC9-ndBb1WR05rRF1msVQDV6EBqB752m6o') {

  if (!firebase._unStub) {
    throw new Error('Please use stubFirebase() before calling this method');
  }

  const config = {
    apiKey: apiKey,
    authDomain: 'emberfire-tests-2c814.firebaseapp.com',
    databaseURL: url,
    storageBucket: '',
  };

  let app;

  try {
    app = firebase.app();
  } catch (e) {
    app = firebase.initializeApp(config);
  }

  const ref = app.database().ref();

  app.database().goOffline(); // must be called after the ref is created

  if (initialData) {
    ref.set(initialData);
  }

  return ref;
}
