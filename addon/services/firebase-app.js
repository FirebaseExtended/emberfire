import firebase from 'firebase';

export const DEFAULT_NAME = '[EmberFire default app]';

export default {
  create() {
    if (!this.config.firebase || typeof this.config.firebase !== 'object') {
      throw new Error('Please set the `firebase` property in your environment config.');
    }

    let app = firebase.app(DEFAULT_NAME);

    if (!app) {
      app = firebase.initializeApp(this.config.firebase, DEFAULT_NAME);
    }

    return app;
  },

  config: null,
  isServiceFactory: true
};
