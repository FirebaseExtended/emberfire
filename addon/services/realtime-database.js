import { getOwner } from '@ember/application';
import _app from 'npm:@firebase/app';
import _database from 'npm:@firebase/database';

export default {
  /**
   * @type {boolean}
   * @default
   * @readonly
   */
  isServiceFactory: true,

  app: undefined,
  databaseURL: undefined,

  /**
   * @param {Object} context
   * @return {firebase.database.Database} The Realtime Database Service
   */
  create(context) {
    const firebase = getOwner(context).lookup('service:firebase');
    return firebase.app(this.app).database(this.databaseURL);
  }

};