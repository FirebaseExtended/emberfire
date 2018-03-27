import Controller from '@ember/controller';
import Ember from 'ember';

const { inject: { service }} = Ember;
import { firebase } from 'emberfire';

export default Controller.extend({
    session: service(),
    firebaseAuth: service(),
    actions: {
        logout() {
            return this.get('session').invalidate();
        },
        login() {
            const provider = new firebase.auth.GoogleAuthProvider();
            return this.get('firebaseAuth').signInWithPopup(provider);
        }
    }
});