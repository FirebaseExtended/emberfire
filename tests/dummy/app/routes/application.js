import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    signIn: function(provider) {
      this.get("session").open("firebase", { provider: provider }).then(function(data) {
        console.log(data);
      });
    },
    signOut: function() {
      this.get("session").close();
    }
  }
});
