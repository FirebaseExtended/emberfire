import Ember from 'ember';

export default Ember.Object.extend({
  firebase: Ember.inject.service(),

  open: function(options) {
    var self = this;

    var provider = options.authWith || options.provider;

    return new Ember.RSVP.Promise((resolve, reject) => {
      if (!provider) {
        reject(new Error('`provider` must be supplied'));
      }

      if (provider === 'password') {
        if (!options.email && !options.password) {
          reject(new Error('`email` and `password` must be supplied'));
        }

        this.get('firebase').authWithPassword({
          email: options.email,
          password: options.password,
        }, (error, authData) => {

          if (error) {
            reject(error);
          } else {
            resolve(authData);
          }
        });

      } else {
        this.get('firebase').authWithOAuthPopup(provider, (error, authData) => {
          if (error) {
            reject(error);
          } else {
            resolve(authData);
          }
        });
      }

    });
  }
});
