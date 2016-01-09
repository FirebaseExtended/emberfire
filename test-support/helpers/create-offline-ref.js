import Firebase from 'firebase';


/**
 * Creates an offline Firebase reference with optional initial data and url.
 *
 * Be sure to `stubFirebase()` and `unstubFirebase()` in your tests!
 *
 * @param  {Object} [initialData]
 * @param  {String} [url]
 * @return {Firebase}
 */
export default function createOfflineRef(initialData, url = 'https://emberfire-tests.firebaseio.com') {

  if (!Firebase._unStub) {
    throw new Error('Please use stubFirebase() before calling this method');
  }

  var ref = new Firebase(url);
  Firebase.goOffline(); // must be called after the ref is created

  if (initialData) {
    ref.set(initialData);
  }

  return ref;
}
