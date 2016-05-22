import Ember from 'ember';

export default Ember.Object.extend({
  firebaseApp: Ember.inject.service(),

  /**
   * Extacts session information from authentication response
   *
   * @param {!firebase.User} user
   * @return {Promise}
   */
  open(user) {
    return Ember.RSVP.resolve({
      provider: this.extractProviderId_(user),
      uid: user.uid,
      currentUser: user
    });
  },


  /**
   * Restore existing authenticated session
   *
   * @return {Promise}
   */
  fetch() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      let auth = this.get('firebaseApp').auth();
      const unsub = auth.onAuthStateChanged((user) => {
        unsub();
        if (!user) {
          reject(new Error('No session available'));
          return;
        }
        resolve(this.open(user));
      },
      (err) => {
        unsub();
        reject(err);
      });
    });
  },


  /**
   * Close existing authenticated session
   *
   * @return {Promise}
   */
  close() {
    return this.get('firebaseApp').auth().signOut();
  },

  /**
   * Extracts the provider id from the firebase user
   *
   * @param {!firebase.User} user
   * @private
   */
  extractProviderId_(user) {
    if (user.isAnonymous) {
      return 'anonymous';
    }

    if (user.providerData && user.providerData.length) {
      return user.providerData[0].providerId;
    }

    return 'custom';
  }
});
