import Base from 'ember-simple-auth/session-stores/base';

import Ember from 'ember';
const { inject: { service }, RSVP: { Promise, resolve }, run } = Ember;

export default Base.extend({
    firebaseAuth: service(),
    restoring: true,
    persist: resolve,
    restore() {
        return new Promise(resolve => {
            this.get('firebaseAuth').onIdTokenChanged(user => run(() => {
                let authenticated = user ? {authenticator: 'authenticator:firebase', user, credential: user.getIdToken(true)} : {};
                if (this.get('restoring')) {
                    this.set('restoring', false);
                    resolve({ authenticated });
                } else {
                    this.trigger('sessionDataUpdated', { authenticated });
                }
            }));
        });
    },
    clear: resolve
});