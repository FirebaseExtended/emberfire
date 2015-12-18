import Ember from 'ember';

export default Ember.Object.extend({
  firebase: Ember.inject.service(),

  open: function(options) {
    var provider = options.provider || options.authWith;

    return new Ember.RSVP.Promise((resolve, reject) => {
      if (!provider) {
        reject(new Error('`provider` must be supplied'));
      }

      var waiter = (() => false);
      if (provider === 'password') {
        if (!options.email && !options.password) {
          reject(new Error('`email` and `password` must be supplied'));
        }

        if (Ember.testing){
          Ember.Test.registerWaiter(waiter);
        }
        this.get('firebase').authWithPassword({
          email: options.email,
          password: options.password,
        }, (error, authData) => {
          if (Ember.testing){
            Ember.Test.unregisterWaiter(waiter);
          }

          if (error) {
            reject(error);
          } else {
            resolve(authData);
          }
        });

      } else if (provider === 'custom') {
        if (!options.token) {
          reject(new Error('A token must be supplied'));
        }
        if (Ember.testing){
          Ember.Test.registerWaiter(waiter);
        }
        this.get('firebase').authWithCustomToken(options.token, (error, authData) => {
          if (Ember.testing){
            Ember.Test.unregisterWaiter(waiter);
          }
          if (error) {
            reject(error);
          } else {
            resolve(authData);
          }
        });
      } else if (provider === 'anonymous') {
        if (Ember.testing){
          Ember.Test.registerWaiter(waiter);
        }
        this.get('firebase').authAnonymously((error, authData) => {
          if (Ember.testing){
            Ember.Test.unregisterWaiter(waiter);
          }
          if (error) {
            reject(error);
          } else {
            resolve(authData);
          }
        });
      } else {
        if (Ember.testing){
          Ember.Test.registerWaiter(waiter);
        }
        this.get('firebase').authWithOAuthPopup(provider, (error, authData) => {
          if (Ember.testing){
            Ember.Test.unregisterWaiter(waiter);
          }
          if (error) {
            reject(error);
          } else {
            resolve(authData);
          }
        }, (options.settings || {}));
      }

    });
  }
});
