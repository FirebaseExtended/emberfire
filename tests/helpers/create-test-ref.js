import Firebase from 'firebase';
import sinon from 'sinon';

import FIREBASE_FIXTURE_DATA from './fixture-data';

export default function createTestRef(child) {

  var FirebaseTestRef = new Firebase('https://emberfire-demo.firebaseio.com');
  FirebaseTestRef.on('value', function() {});
  FirebaseTestRef.off('value', function() {});

  var FirebaseSet = Firebase.prototype.set;
  var FirebaseUpdate = Firebase.prototype.update;

  // sinon.stub(Firebase.prototype, 'set', function(data, afterSet) {
  //   FirebaseSet.call(this, data, afterSet);
  //   if (typeof afterSet === 'function') {
  //     afterSet();
  //   }
  // });

  // sinon.stub(Firebase.prototype, 'update', function(data, afterUpdate) {
  //   FirebaseUpdate.call(this, data, afterUpdate);
  //   if (typeof afterUpdate === 'function') {
  //     afterUpdate();
  //   }
  // });

  FirebaseTestRef.set(FIREBASE_FIXTURE_DATA);

  if (child) {
    return FirebaseTestRef.child(child);
  }

  return FirebaseTestRef;
}
