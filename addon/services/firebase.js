import { getOwner } from '@ember/application';
import firebase from 'npm:firebase';
import Ember from 'ember';

export default {
  /**
   * @type {boolean}
   * @default
   * @readonly
   */
  isServiceFactory: true,

  /**
   * @param {Object} context
   * @return {firebase} The firebase global namespace
   */
  create(context) {
    firebase.Promise = Ember.RSVP.Promise;
    const config = getOwner(context).resolveRegistration('config:environment');
    if (!config || typeof config.firebase !== 'object') {
      throw new Error('Please set the `firebase` property in your environment config.');
    }
    if (typeof config.firebase.length === 'undefined') {
      firebase.initializeApp(config.firebase)
    } else {
      config.firebase.forEach(appConfig => {
        const name = appConfig.name;
        delete appConfig.name;
        firebase.initializeApp(appConfig, name);
      })
    }
    return firebase;
  }

};