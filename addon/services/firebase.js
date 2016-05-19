import firebase from 'firebase';

export default {
  create() {
    firebase.initializeApp(this.config.firebase);
    firebase.database().ref().remove();
    return firebase.database().ref();
  },

  config: null,
  isServiceFactory: true
};
