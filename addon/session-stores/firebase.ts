import Base from 'ember-simple-auth/session-stores/base';

import { get, set } from '@ember/object';
import RSVP from 'rsvp';
import Ember from 'ember';

const { Promise, resolve } = RSVP;
const { run } = Ember;

import 'firebase/auth';
import { inject as service } from '@ember/service';

export default Base.extend({

    restoring: true,
    persist: resolve,
    clear: resolve,

    firebaseApp: service('firebase-app'),

    restore() {
        return new Promise(resolve => {
            get(this, 'firebaseApp').auth().onIdTokenChanged((user:any) => run(() => {
                let authenticated = user ? {authenticator: 'authenticator:firebase', user, credential: user.getIdToken(true)} : {};
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