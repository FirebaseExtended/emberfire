import Service from '@ember/service';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Ember from 'ember';
import FirebaseService from './firebase';

import RSVP, { reject } from 'rsvp';
const { resolve } = RSVP;

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
    auth = () => getApp(this).auth && resolve(getApp(this).auth()) || reject('import "firebase/auth"');
    database = (databaseURL?: string) => getApp(this).database && resolve(getApp(this).database(databaseURL)) || reject('import "firebase/database"');
    firestore = () => getApp(this).firestore && resolve(getApp(this).firestore()) || reject('import "firebase/firestore"');
    functions = (region?: string) => getApp(this).functions && resolve(getApp(this).functions(region)) || reject('import "firebase/functions"');
    messaging = () => getApp(this).messaging && resolve(getApp(this).messaging()) || reject('import "firebase/messaging"');
    storage = (storageBucket?: string) => getApp(this).storage && resolve(getApp(this).storage(storageBucket)) || reject('import "firebase/storage"');

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