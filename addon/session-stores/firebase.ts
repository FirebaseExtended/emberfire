import Base from 'ember-simple-auth/session-stores/base';

import { get, set } from '@ember/object';
import RSVP from 'rsvp';

const { Promise, resolve } = RSVP;
import { run } from '@ember/runloop';

import 'npm:firebase/auth';
import { inject as service } from '@ember/service';

export default Base.extend({

    restoring: true,
    persist: resolve,
    clear: resolve,

    firebaseApp: service('firebase-app'),

    restore() {
        return new Promise(resolve => {
            get(this, 'firebaseApp').auth().onIdTokenChanged((user:any) => run(() => {
                let authenticated = user ? {authenticator: 'authenticator:firebase', user, credential: user.getIdToken()} : {};
                if (get(this, 'restoring')) {
                    set(this, 'restoring', false);
                    resolve({ authenticated });
                } else {
                    this.trigger('sessionDataUpdated', { authenticated });
                }
            }));
        });
    }
})