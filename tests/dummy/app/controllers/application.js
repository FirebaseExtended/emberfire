import Controller from '@ember/controller';
import Ember from 'ember';

import firebase from 'npm:firebase';

const { inject: { service }} = Ember;

export default Controller.extend({
    session: service(),
    firebase: service(),
    actions: {
        logout() {
            return this.get('session').invalidate();
        },
        login() {
            const provider = new firebase.auth.GoogleAuthProvider();
            return this.get('firebase').auth().signInWithPopup(provider);
        }
    }
});