import firebase from 'firebase';
import Ember from 'ember';

const { getOwner } = Ember;

export const DEFAULT_NAME = '[EmberFire default app]';

export default {
  create(application) {
    const config = getOwner(application)._lookupFactory('config:environment');
    if (!config || typeof config.firebase !== 'object') {
      throw new Error('Please set the `firebase` property in your environment config.');
    }

    let app;

    try {
      app = firebase.app(DEFAULT_NAME);
    } catch (e) {
      app = firebase.initializeApp(config.firebase, DEFAULT_NAME);
    }

    return app.database().ref();
  },

  config: null,
  isServiceFactory: true
};
