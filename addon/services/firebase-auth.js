import { getOwner } from '@ember/application';
import _ from 'npm:@firebase/auth';

export default {
  /**
   * @type {boolean}
   * @default
   * @readonly
   */
  isServiceFactory: true,

  app: undefined,

  /**
   * @param {Object} context
   * @return {firebase.auth.Auth} The Authentication Service
   */
  create(context) {
    const firebase = getOwner(context).lookup('service:firebase');
    return firebase.auth(this.app);
  }

};