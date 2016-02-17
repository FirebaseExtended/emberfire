import Ember from 'ember';
import Waitable from '../mixins/waitable';

export default Ember.Object.extend(Waitable, {
  firebase: Ember.inject.service(),

  open(options) {
    var provider = options.provider || options.authWith;
    var reject = Ember.RSVP.reject;

    if (!provider) {
      return reject(new Error('`provider` must be supplied'));
    }

    var ref = this.get('firebase');

    switch (provider) {
      case 'password':
        if (!options.email && !options.password) {
          return reject(new Error('`email` and `password` must be supplied'));
        }

        return this._toPromise(ref, 'authWithPassword', {
          email: options.email,
          password: options.password,
        });


      case 'custom':
        if (!options.token) {
          return reject(new Error('A token must be supplied'));
        }

        return this._toPromise(ref, 'authWithCustomToken', options.token);

      case 'anonymous':
        return this._toPromise(ref, 'authAnonymously');

      // oauth providers e.g. 'twitter'
      default:
        let providerSettings = options.settings || {};
        if (options.redirect === true) {
          // promise will never resolve unless there is an error
          return this._toPromise(ref, 'authWithOAuthRedirect', provider, providerSettings);
        }
        return this._toPromise(ref, 'authWithOAuthPopup', provider, providerSettings);
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
