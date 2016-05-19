import firebase from 'firebase';


/**
 * Creates an offline firebase reference with optional initial data and url.
 *
 * Be sure to `stubfirebase()` and `unstubfirebase()` in your tests!
 *
 * @param  {Object} [initialData]
 * @param  {String} [url]
 * @return {firebase}
 */
export default function createOfflineRef(initialData, url = 'https://emberfire-tests.firebaseio.com') {

  if (!firebase._unStub) {
    throw new Error('Please use stubFirebase() before calling this method');
  }

  var ref = firebase.database().ref();
  firebase.database().goOffline(); // must be called after the ref is created

  if (initialData) {
    ref.set(initialData);
  }

  return ref;
}
