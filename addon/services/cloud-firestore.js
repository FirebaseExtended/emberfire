import { getOwner } from '@ember/application';
import _ from 'npm:@firebase/firestore';

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
   * @return {firebase.firestore.Firestore} The Firestore service
   */
  create(context) {
    const firebase = getOwner(context).lookup('service:firebase');
    return firebase.firestore(this.app);
  }

};