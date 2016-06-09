import Ember from 'ember';
import firebase from 'firebase';

const { run } = Ember;

/**
 * Destroy all Firebase apps.
 */
export default function destroyFirebaseApps() {
  const deletions = firebase.apps.map((app) => app.delete());
  Ember.RSVP.all(deletions).then(() => run(() => {
    // NOOP to delay run loop until the apps are destroyed
  }));
}
