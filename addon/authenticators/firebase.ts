import Base from 'ember-simple-auth/authenticators/base';
import RSVP from 'rsvp';
const { resolve, reject, Promise } = RSVP;

import 'npm:firebase/auth';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
 
export default Base.extend({
    
    firebase: service('firebase'),

    restore(data: any) {
        return resolve(data);
    },
    authenticate() {
        return reject(new Error('Please authenticate via the Firebase SDK directly.'));
    },
    invalidate() {
        return new Promise((resolve, reject) => {
            get(this, 'firebase').app().auth!().signOut().then(resolve).catch(reject);
        })
    }
});