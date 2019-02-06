import BaseSessionStore from 'ember-simple-auth/session-stores/base';

import { get, set } from '@ember/object';
import RSVP from 'rsvp';

import Ember from 'ember';
import FirebaseAppService from '../services/firebase-app';

const { Promise, resolve } = RSVP;
import { run } from '@ember/runloop';

import 'firebase/auth';
import { inject as service } from '@ember/service';

export default class FirebaseSessionStore extends BaseSessionStore.extend({
    firebaseApp: service('firebase-app')
}) { 

    // @ts-ignore repeat here for typedoc
    firebaseApp: Ember.ComputedProperty<FirebaseAppService, FirebaseAppService>;

    restoring = true;
    persist = resolve;
    clear = resolve;

    restore() {
        return new Promise(resolve => {
            get(this, 'firebaseApp').auth().onIdTokenChanged(user => run(() => {
                let authenticated = user ? {authenticator: 'authenticator:firebase', user, credential: user.getIdToken()} : {};
                if (get(this, 'restoring')) {
                    set(this, 'restoring', false);
                    resolve({ authenticated });
                } else {
                    this.trigger('sessionDataUpdated', { authenticated });
                }
            }));
        });
    }

}