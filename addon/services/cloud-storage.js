import { getOwner } from '@ember/application';
import _app from 'npm:@firebase/app';
import _storage from 'npm:@firebase/storage';

export default {
  /**
   * @type {boolean}
   * @default
   * @readonly
   */
  isServiceFactory: true,

  app: undefined,
  storageBucket: undefined,

  /**
   * @param {Object} context
   * @return {firebase.storage.Storage} The Storage Service
   */
  create(context) {
    const firebase = getOwner(context).lookup('service:firebase');
    return firebase.app(this.app).storage(this.storageBucket);
  }

};