import Service from '@ember/service';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Ember from 'ember';
import FirebaseService from './firebase';

import RSVP from 'rsvp';
const { resolve } = RSVP;

// TODO move these over to dynamic imports
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/messaging';
import 'firebase/storage';

// @ts-ignore
import { app, auth, database, firestore, functions, messaging, storage } from 'firebase/app';

const getApp = (service: FirebaseAppService): app.App => {
    const firebase = get(service, 'firebase');
    const name = get(service, 'name');
    return firebase.app(name);
}

export default class FirebaseAppService extends Service.extend({

    name: undefined,
    firebase: service('firebase')

}) {

    // @ts-ignore repeat here for typedocs
    firebase: Ember.ComputedProperty<FirebaseService, FirebaseService>; name?: string;

    options?: object;

    delete = () => getApp(this).delete();
    auth = () => resolve(getApp(this).auth());
    database = (databaseURL?: string) => resolve(getApp(this).database(databaseURL));
    firestore = () => resolve(getApp(this).firestore());
    functions = (region?: string) => resolve(getApp(this).functions(region));
    messaging = () => resolve(getApp(this).messaging());
    storage = (storageBucket?: string) => resolve(getApp(this).storage(storageBucket));

    init() {
        this._super(...arguments);
        const app = getApp(this);
        set(this, 'options', app.options);
    }

}

declare module '@ember/service' {
  interface Registry {
    "firebase-app": FirebaseAppService;
  }
}