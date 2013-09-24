App = Ember.Application.create();

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return FB.Array.create({
      ref: new Firebase("https://ember-chat.firebaseio-demo.com/")
    });
  }
});

App.IndexController = Ember.ArrayController.extend({
  msg: "",
  from: "Guest" + Math.floor(Math.random() * 100),
  actions: {
    sendMessage: function() {
      this.pushObject({from: this.get("from"), msg: this.get("msg")});
      this.set("msg", null);
    }
  }
});
