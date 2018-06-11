import Base from 'ember-simple-auth/session-stores/base';

import { get, set } from '@ember/object';
import RSVP from 'rsvp';
import Ember from 'ember';

const { Promise, resolve } = RSVP;
const { run } = Ember;

import 'npm:firebase/auth';
import { inject as service } from '@ember/service';

export default Base.extend({

    restoring: true,
    persist: resolve,
    clear: resolve,

    firebase: service('firebase'),

    restore() {
        return new Promise(resolve => {
            get(this, 'firebase').app().auth!().onIdTokenChanged((user:any) => run(() => {
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