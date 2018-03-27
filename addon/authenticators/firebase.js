import Base from 'ember-simple-auth/authenticators/base';

import Ember from 'ember';
const { RSVP: { resolve, reject}, inject: { service } } = Ember;

export default Base.extend({
    firebaseAuth: service(),
    restore(data) {
        return resolve(data);
    },
    authenticate() {
        return reject(new Error('Please authenticate via the Firebase SDK directly.'));
    },
    invalidate() {
        return this.get('firebaseAuth').signOut();
    }
});