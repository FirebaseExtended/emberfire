import { getOwner } from '@ember/application';

import firebase from 'npm:firebase';

export default {
  /**
   * @type {boolean}
   * @default
   * @readonly
   */
  isServiceFactory: true,

  /**
   * @param {Object} context
   * @return {Firebase} Initialized Firebase app
   */
  create(context) {
    const config = getOwner(context).resolveRegistration('config:environment');
    try {
      return firebase.initializeApp(config.firebase);
    } catch (e) {
      if (e.code == 'app/duplicate-app') {
        return firebase.app()
      } else {
        throw e;
      }
    }
  },
};