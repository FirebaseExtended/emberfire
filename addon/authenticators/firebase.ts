import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import RSVP from 'rsvp';
import Ember from 'ember';
import FirebaseAppService from '../services/firebase-app';

const { resolve, reject } = RSVP;

import { inject as service } from '@ember/service';
import { get } from '@ember/object';
 
export default class FirebaseAuthenticator extends BaseAuthenticator.extend({
    
    firebaseApp: service('firebase-app'),
    
}) {

    // @ts-ignore repeat here for typedoc
    firebaseApp: Ember.ComputedProperty<FirebaseAppService, FirebaseAppService>;

    restore(data: any) {
        return resolve(data);
    }

    authenticate() {
        return reject(new Error('Please authenticate via the Firebase SDK directly.'));
    }

    invalidate() {
        return get(this, 'firebaseApp').auth().then(auth => auth.signOut());
    }

}