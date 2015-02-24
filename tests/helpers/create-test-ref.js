import Firebase from 'firebase';

import FIREBASE_FIXTURE_DATA from './fixture-data';

export default function createTestRef(child) {
  var ref = new Firebase('https://emberfire-demo.firebaseio.com');
  Firebase.goOffline(); // must be after the ref is created
  ref.on('value', function() {});
  ref.off('value', function() {});

  ref.set(FIREBASE_FIXTURE_DATA);

  if (child) {
    return ref.child(child);
  }

  return ref;
}
