import Firebase from 'firebase';

export default function unstubFirebase() {
  if (typeof Firebase._unStub === 'function') {
    Firebase._unStub();
    delete Firebase._unStub;
  }
}
