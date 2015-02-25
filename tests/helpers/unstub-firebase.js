import Firebase from 'firebase';

export default function unstubFirebase() {
  // Firebase.goOnline();

  if (!Firebase.prototype.set.restore) {
    Firebase.prototype.set.restore();
    Firebase.prototype.update.restore();
  }
}
