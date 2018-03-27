import { getOwner } from '@ember/application';
import _ from 'npm:@firebase/functions';

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
   * @return {firebase.functions.Functions} The Functions service
   */
  create(context) {
    const firebase = getOwner(context).lookup('service:firebase');
    return firebase.functions(this.app);
  }

};