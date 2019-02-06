import Service from '@ember/service';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Ember from 'ember';
import FirebaseService from './firebase';

import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/messaging';
import 'firebase/storage';

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
    auth = (): auth.Auth => getApp(this).auth();
    database = (databaseURL?: string): database.Database => getApp(this).database(databaseURL);
    firestore = (): firestore.Firestore => getApp(this).firestore();
    functions = (region?: string): functions.Functions => getApp(this).functions(region);
    messaging = (): messaging.Messaging => getApp(this).messaging();
    storage = (storageBucket?: string): storage.Storage => getApp(this).storage(storageBucket);

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