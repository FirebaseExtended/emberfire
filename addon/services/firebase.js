import firebase from 'firebase';

export const DEFAULT_NAME = '[EmberFire default app]';

export default {
  create(application) {
    const config = this.config;
    if (!config || typeof config.firebase !== 'object') {
      throw new Error('Please set the `firebase` property in your environment config.');
    }

    let app = firebase.app(DEFAULT_NAME);

    if (!app) {
      app = firebase.initializeApp(config.firebase, DEFAULT_NAME);
    }

    return app.database().ref();
  },

  config: null,
  isServiceFactory: true
};
