import FirebaseAdapter from 'emberfire/adapters/firebase';
import createTestRef from './create-test-ref';

export default function createTestAdapter(child) {

  return FirebaseAdapter.extend({
    firebase: createTestRef(child),
    _queueFlushDelay: false
  });
}
