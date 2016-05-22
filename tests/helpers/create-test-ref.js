import FIREBASE_FIXTURE_DATA from './fixture-data';
import createOfflineRef from './create-offline-ref';


export default function createTestRef(child) {
  var ref = createOfflineRef(FIREBASE_FIXTURE_DATA);

  if (child) {
    return ref.child(child);
  }

  return ref;
}
