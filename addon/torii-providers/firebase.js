import Ember from 'ember';
import Waitable from '../mixins/waitable';
import firebase from 'firebase';

export default Ember.Object.extend(Waitable, {
  firebase: Ember.inject.service(),
  providers: {
    twitter: new firebase.auth.TwitterAuthProvider(),
    facebook: new firebase.auth.FacebookAuthProvider(),
    github: new firebase.auth.GithubAuthProvider(),
    google: new firebase.auth.GoogleAuthProvider(),
  },

  open(options) {
    var provider = options.provider || options.authWith;
    var reject = Ember.RSVP.reject;

    if (!provider) {
      return reject(new Error('`provider` must be supplied'));
    }

    var auth = firebase.auth();

    switch (provider) {
      case 'password':
        if (!options.email && !options.password) {
          return reject(new Error('`email` and `password` must be supplied'));
        }

        return auth.signInWithEmailAndPassword(options.email, options.password);

      case 'custom':
        if (!options.token) {
          return reject(new Error('A token must be supplied'));
        }

        return auth.signInWithCustomToken(options.token);

      case 'anonymous':
        return auth.signInAnonymously();

      // oauth providers e.g. 'twitter'
      default:
        console.log(this.providers[provider], provider);
        if (options.redirect === true) {
          // promise will never resolve unless there is an error
          return auth.signInWithRedirect(this.providers[provider]);
        }
        return auth.signInWithPopup(this.providers[provider]);
    }
  },


  /**
   * Promisify auth methods, and
   * @param  {Firebase} ref
   * @param  {String} method
   * @param  {Object|String} [param]
   * @param  {Object} [options]
   * @return {Promise}
   */
  _toPromise(ref, method, param, options) {
    this._incrementWaiters();

    return new Ember.RSVP.Promise((resolve, reject) => {

      var onComplete = (error, authData) => {
        this._decrementWaiters();
        if (error) {
          reject(error);
        } else {
          resolve(authData);
        }
      };

      var args = [];

      if (typeof param !== 'undefined') {
        args.push(param);
      }

      args.push(onComplete);

      if (typeof options !== 'undefined') {
        args.push(options);
      }

      ref[method].apply(ref, args);
    });
  }
});
