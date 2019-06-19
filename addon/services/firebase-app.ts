import Service from '@ember/service';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Ember from 'ember';
import FirebaseService from './firebase';

import RSVP from 'rsvp';
const { resolve } = RSVP;

const getApp = (service: FirebaseAppService) => {
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

    auth        = () => resolve(import('firebase/auth')     ).then(() => getApp(this).auth());
    firestore   = () => resolve(import('firebase/firestore')).then(() => getApp(this).firestore());
    messaging   = () => resolve(import('firebase/messaging')).then(() => getApp(this).messaging());
    database    = (url?: string)    => resolve(import('firebase/database') ).then(() => getApp(this).database(url));
    functions   = (region?: string) => resolve(import('firebase/functions')).then(() => getApp(this).functions(region));

    // TODO: drop the <any> once firebase-js-sdk #1792 and #1812 and patched in, they were missing typings
    performance = ()                => resolve(import(<any>'firebase/performance')).then(() => getApp(this).performance());
    storage     = (url?: string)    => resolve(import(<any>'firebase/storage')    ).then(() => getApp(this).storage(url));

    init(...args: any[]) {
        // @ts-ignore because ember do pass arguments here
        super.init(...args);
        const app = getApp(this);
        set(this, 'options', app.options);
    }

}

declare module '@ember/service' {
  interface Registry {
    "firebase-app": FirebaseAppService;
  }
}
