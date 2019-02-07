import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import firebase from 'firebase/app';

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
            return this.get('firebaseApp').auth().then(auth => auth.signInWithPopup(provider));
        }
    }
});