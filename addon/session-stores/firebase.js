import Base from 'ember-simple-auth/session-stores/base';

import Ember from 'ember';
const { RSVP, run } = Ember;
const { inject: { service }} = Ember;
const { Promise } = RSVP;

export default Base.extend({
    firebase: service(),
    restoring: true,
    persist() {
        return RSVP.resolve();
    },
    restore() {
        return new Promise(resolve => {
            this.get('firebase').auth().onIdTokenChanged(user => run(() => {
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
    clear() {
        return RSVP.resolve();
    }
});