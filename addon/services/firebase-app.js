import { getOwner } from '@ember/application';
import _ from 'npm:@firebase/app';

export default {
  /**
   * @type {boolean}
   * @default
   * @readonly
   */
  isServiceFactory: true,

  firebaseAppName: undefined,

  /**
   * @param {Object} context
   * @return {firebase.app.App} An initialized Firebase app
   */
  create(context) {
    const firebase = getOwner(context).lookup('service:firebase');
    return firebase.app(this.firebaseAppName);
  }

};