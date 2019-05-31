// @ts-ignore Node.js issues
import _firebase from 'firebase/app';
import Service from '@ember/service';
import { app } from 'firebase/app';

const firebase = _firebase as typeof import('firebase/app');

export default class FirebaseService extends Service {

  app = (name?: string) => firebase.app(name);
  apps = firebase.apps;
  initializeApp = (options: Object, nameOrConfig?: string|Object) => firebase.initializeApp(options, nameOrConfig as string | undefined);

}

declare module '@ember/service' {
  interface Registry {
    firebase: FirebaseService;
  }
}
