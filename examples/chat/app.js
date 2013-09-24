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

App.ScrollingDivComponent = Ember.Component.extend({
  scheduleScrollIntoView: function() {
    // Only run once per tick, once rendering has completed;
    // avoid flood of scrolls when many updates happen at once
    Ember.run.scheduleOnce("afterRender", this, "scrollIntoView");
  }.observes("update-when.@each"),

  scrollIntoView: function() {
    this.$().scrollTop(this.$().prop("scrollHeight"));
  }
});
