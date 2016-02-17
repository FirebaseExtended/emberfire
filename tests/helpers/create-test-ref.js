import createOfflineRef from './create-offline-ref';
import FIREBASE_FIXTURE_DATA from './fixture-data';


export default function createTestRef(child) {
  var ref = createOfflineRef(FIREBASE_FIXTURE_DATA);

  if (child) {
    return ref.child(child);
  }

  return ref;
}
