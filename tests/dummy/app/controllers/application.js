import Controller from '@ember/controller';
import Ember from 'ember';

const { inject: { service }} = Ember;
import * as firebase from 'firebase/app';

export default Controller.extend({
    session: service(),
    firebaseApp: service(),
    firebaseSecondApp: service(),
    actions: {
        logout() {
            return this.get('session').invalidate();
        },
        login() {
            const provider = new firebase.auth.GoogleAuthProvider();
            return this.get('firebaseApp').auth().signInWithPopup(provider);
        }
    }
});