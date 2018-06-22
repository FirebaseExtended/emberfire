import Ember from 'ember';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';

// TODO no regsiterAuth...
import {  } from  '@firebase/auth';
import { registerDatabase } from '@firebase/database';
// @ts-ignore TODO missing types
import { registerFirestore } from '@firebase/firestore';
import { registerFunctions } from '@firebase/functions';
import { registerMessaging } from '@firebase/messaging';
import { registerStorage } from '@firebase/storage';

import { app, auth, database, firestore, functions, messaging, storage } from 'firebase';

const getApp = (service: FirebaseApp) => {
    const firebase = get(service, 'firebase');
    const name = get(service, 'name');
    // TODO raise exception is undefined? or does it already?
    return (firebase.app(name) as any) as app.App;
}

export default class FirebaseApp extends Ember.Service.extend({

    name: undefined,
    firebase: service('firebase')

}) {

    options?: {[key:string]: any};
    auth = (): auth.Auth => {
        return getApp(this).auth();
    };
    database = (databaseURL?: string): database.Database => {
        const app: any = getApp(this);
        if (app.database === undefined) { registerDatabase(app.firebase_) }
        return app.database(databaseURL);
    };
    firestore = (): firestore.Firestore => {
        const app: any = getApp(this);
        if (app.firestore === undefined) { registerFirestore(app.firebase_) }
        return app.firestore();
    }
    functions = (): functions.Functions => {
        const app: any = getApp(this);
        if (app.functions === undefined) { registerFunctions(app.firebase_) }
        return app.functions();
    }
    messaging = (): messaging.Messaging => {
        const app: any = getApp(this);
        if (app.messaging === undefined) { registerMessaging(app.firebase_) }
        return app.messaging();
    }
    storage = (storageBucket?: string): storage.Storage => {
        const app: any = getApp(this);
        if (app.storage === undefined) { registerStorage(app.firebase_) }
        return app.storage(storageBucket);
    }

    init() {
        this._super(...arguments);
        const app = getApp(this);
        set(this, 'options', app.options);
    }

};

declare module '@ember/service' {
  interface Registry {
    "firebase-app": FirebaseApp;
  }
}