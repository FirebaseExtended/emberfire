import firebase from 'firebase';
import Ember from 'ember';

const { getOwner } = Ember;

export default {
  create(application) {
    const config = getOwner(application).resolveRegistration('config:environment');
    if (!config || typeof config.firebase !== 'object') {
      throw new Error('Please set the `firebase` property in your environment config.');
    }

    let app;

    try {
      app = firebase.app();
    } catch (e) {
      app = firebase.initializeApp(config.firebase);
    }

    return app.database().ref();
  },

  config: null,
  isServiceFactory: true
};
