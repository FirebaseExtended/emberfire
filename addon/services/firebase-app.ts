import Service from '@ember/service';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Ember from 'ember';
import FirebaseService from './firebase';

import RSVP from 'rsvp';
import { auth, database, firestore, functions, messaging, storage, performance } from 'firebase';
const { resolve } = RSVP;

const getApp = (service: FirebaseAppService)=> {
    const firebase = get(service, 'firebase');
    const name = get(service, 'name');
    return firebase.app(name);
}

// dynamically import the Firebase module required
function getModuleFactory(service: FirebaseAppService, module: 'auth'): () => RSVP.Promise<auth.Auth>;
function getModuleFactory(service: FirebaseAppService, module: 'database'): (databaseURL?: string) => RSVP.Promise<database.Database>;
function getModuleFactory(service: FirebaseAppService, module: 'firestore'): () => RSVP.Promise<firestore.Firestore>;
function getModuleFactory(service: FirebaseAppService, module: 'functions'): (region?: string) => RSVP.Promise<functions.Functions>;
function getModuleFactory(service: FirebaseAppService, module: 'messaging'): () => RSVP.Promise<messaging.Messaging>;
function getModuleFactory(service: FirebaseAppService, module: 'performance'): () => RSVP.Promise<performance.Performance>;
function getModuleFactory(service: FirebaseAppService, module: 'storage'): (bucket?: string) => RSVP.Promise<storage.Storage>;
function getModuleFactory(service: FirebaseAppService, module: string) {
  return (...options: any[]) => resolve(getApp(service)).then((app:any) => import(`firebase/${module}`).then(() => app[module](...options)));
}

export default class FirebaseAppService extends Service.extend({

    name: undefined,
    firebase: service('firebase')

}) {

    // @ts-ignore repeat here for typedocs
    firebase: Ember.ComputedProperty<FirebaseService, FirebaseService>; name?: string;

    options?: object;

    delete = () => getApp(this).delete();

    auth        = getModuleFactory(this, 'auth');
    database    = getModuleFactory(this, 'database');
    firestore   = getModuleFactory(this, 'firestore');
    functions   = getModuleFactory(this, 'functions');
    messaging   = getModuleFactory(this, 'messaging');
    performance = getModuleFactory(this, 'performance');
    storage     = getModuleFactory(this, 'storage');

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