import Controller from '@ember/controller';
import Ember from 'ember';

const { inject: { service }} = Ember;
import { default as firebase } from 'npm:firebase/app';

export default Controller.extend({
    session: service(),
    actions: {
        logout() {
            return this.get('session').invalidate();
        },
        login() {
            const provider = new firebase.auth.GoogleAuthProvider();
            return firebase.app().auth().signInWithPopup(provider);
        }
    }
});