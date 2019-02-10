import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';

import { get } from '@ember/object';
import RSVP from 'rsvp';

import Ember from 'ember';
import FirebaseAppService from '../services/firebase-app';

const { Promise, reject } = RSVP;
import { run } from '@ember/runloop';
import { resolve } from 'path';

export default class FirebaseToriiAdapter extends EmberObject.extend({
    firebaseApp: service('firebase-app')
}) {

    // @ts-ignore repeat here for typedoc
    firebaseApp: Ember.ComputedProperty<FirebaseAppService, FirebaseAppService>;

    open(user:any) {
        return resolve(user);
    }

    restore() {
        return new Promise(resolve => {
            get(this, 'firebaseApp').auth().then(auth => {
                const unsubscribe = auth.onIdTokenChanged(currentUser => run(() => {
                    unsubscribe();
                    if (currentUser) {
                        resolve({currentUser});
                    } else {
                        reject();
                    }
                }))
            });
        });
    }

    close() {
        return get(this, 'firebaseApp').auth().then(auth => auth.signOut());
    }

}