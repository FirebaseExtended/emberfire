import Firebase from 'firebase';

export default {
  create() {
    return new Firebase(this.config.firebase);
  },

  config: null,
  isServiceFactory: true
};
