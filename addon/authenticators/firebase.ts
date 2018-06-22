import Base from 'ember-simple-auth/authenticators/base';
import RSVP from 'rsvp';

const { resolve, reject, Promise } = RSVP;

import 'firebase/auth';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
 
export default Base.extend({
    
    firebaseApp: service('firebase-app'),

    restore(data: any) {
        return resolve(data);
    },
    authenticate() {
        return reject(new Error('Please authenticate via the Firebase SDK directly.'));
    },
    invalidate() {
        return new Promise<void>((resolve, reject) => {
            get(this, 'firebaseApp').auth().signOut().then(resolve).catch(reject);
        })
    }
});