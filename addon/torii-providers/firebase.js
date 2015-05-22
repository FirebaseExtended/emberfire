import Ember from 'ember';

export default Ember.Object.extend({
  firebase: Ember.inject.service(),

  open: function(options) {
    var self = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      self.get('firebase').authWithOAuthPopup(options.authWith, function(error, authData) {
        if (error) {
          reject(error);
        } else {
          resolve(authData);
        }
      });
    });
  }
});
