import Evented from '@ember/object/evented';
import EmberObject from '@ember/object';
import { get, set } from '@ember/object';
import { Promise, resolve } from 'rsvp';
import FirebaseAppService from '../services/firebase-app';
import { run } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default class FirebaseSessionStore extends EmberObject.extend(Evented) {
  // @ts-ignore repeat here for typedoc
  @service declare firebaseApp: FirebaseAppService;

  restoring = true;
  persist = resolve;
  clear = resolve;

  restore() {
    return new Promise((resolve) => {
      get(this, 'firebaseApp')
        .auth()
        .then((auth) =>
          auth.onIdTokenChanged((user) =>
            run(() => {
              let authenticated = user
                ? {
                    authenticator: 'authenticator:firebase',
                    user,
                    credential: user.getIdToken(),
                  }
                : {};
              if (get(this, 'restoring')) {
                set(this, 'restoring', false);
                resolve({ authenticated });
              } else {
                this.trigger('sessionDataUpdated', { authenticated });
              }
            })
          )
        );
    });
  }
}
