import Ember from 'ember';

export default Ember.Object.extend({

  /**
   * Return a user from the store. If the user doesn't exist, create a new user
   *
   * @param {String} username
   * @return {Promise}
   */
  getUserByUsername: function(username) {
    var store = this.get('store');
    username = username.replace(/[^a-zA-Z0-9 -]/g, '');
    return this.get('store').find('user', username).then(function(user) {
      return user;
    }, function() {
      // HACK: `find()` creates an entry in store.typeMapFor().idToRecord which prevents `createRecord()` from working
      delete store.typeMapFor(store.modelFor('user')).idToRecord[username];
      // A user couldn't be found, so create a new user
      var user = store.createRecord('user', {
        id: username,
        created: new Date().getTime()
      });
      // Save the user
      user.save();
      return user;
    });
  }

});
