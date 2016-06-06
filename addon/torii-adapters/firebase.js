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
    return this.fetchAuthState_()
      .then((user) => {
        if (!user) {
          return this.fetchRedirectState_();
        }
        return user;
      })
      .then((user) => {
        if (!user) {
          return Ember.RSVP.reject(new Error('No session available'));
        }
        return this.open(user);
      })
      .catch((err) => Ember.RSVP.reject(err));
  },


  /**
   * Fetches the redirect user, if any.
   *
   * @return {!Promise<?firebase.User>}
   * @private
   */
  fetchRedirectState_() {
    let auth = this.get('firebaseApp').auth();
    return auth.getRedirectResult()
      .then(result => result.user);
  },


  /**
   * Promisifies the first value of onAuthStateChanged
   *
   * @return {!Promise<?firebase.User>}
   * @private
   */
  fetchAuthState_() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      let auth = this.get('firebaseApp').auth();
      const unsub = auth.onAuthStateChanged((user) => {
        unsub();
        resolve(user);
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
