import firebase from 'firebase';

export default function unstubFirebase() {
  if (typeof firebase._unStub === 'function') {
    firebase._unStub();
    delete firebase._unStub;
  }
}
