import Base from 'ember-simple-auth/authenticators/base';
import RSVP from 'rsvp';
const { resolve, reject, Promise } = RSVP;
// @ts-ignore
import { default as firebase, app } from 'npm:firebase/app';
// @ts-ignore
import { default as ugh } from 'npm:firebase/auth'; ugh;
 
export default Base.extend({
    
    firebaseApp: undefined,

    restore(data: any) {
        return resolve(data);
    },
    authenticate() {
        return reject(new Error('Please authenticate via the Firebase SDK directly.'));
    },
    invalidate() {
        return new Promise((resolve, reject) => {
            firebase.app().auth().signOut().then(resolve).catch(reject);
        })
    }
});