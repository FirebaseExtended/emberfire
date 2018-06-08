import Base from 'ember-simple-auth/session-stores/base';

import { get, set } from '@ember/object';
import RSVP from 'rsvp';
import Ember from 'ember';

const { Promise, resolve } = RSVP;
const { run } = Ember;

// @ts-ignore
import { default as firebase, app } from 'npm:firebase/app';
// @ts-ignore
import { default as ugh } from 'npm:firebase/auth'; ugh;

export default Base.extend({

    restoring: true,
    persist: resolve,
    clear: resolve,

    restore() {
        return new Promise(resolve => {
            app().auth().onIdTokenChanged((user:any) => run(() => {
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