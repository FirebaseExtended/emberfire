/*global describe, before, beforeEach, after, afterEach, specify, it, assert, App, FirebaseTestRef, TestHelpers */

describe("FirebaseAdapter - Deleting records", function() {
  var store, adapter;

  var setupAdapter = function() {
    App.ApplicationAdapter = DS.FirebaseAdapter.extend({
      firebase: FirebaseTestRef.child("blogs/normalized"),
      _queueFlushDelay: 0
    });
    store = App.__container__.lookup("store:main");
    adapter = App.__container__.lookup("adapter:application");
  };


  afterEach(function() {
    App.reset();
  });

  describe("when a belongsTo relationship exists", function() {
    var _ref, newPost, newUser, userData, postId, userRef, userId;

    beforeEach(function(done) {
      setupAdapter();
      _ref = adapter._ref;
      var reference = FirebaseTestRef.child("blogs/tests/adapter/deleterecord/normalized");
      adapter._ref = reference;
      Ember.run(function() {
        newUser = store.createRecord("user", {
          firstName: "Tom"
        });
        newPost = store.createRecord("post", {
          title: "New Post"
        });
        postId = newPost.get('id');
        userId = newUser.get('id');
        userRef = FirebaseTestRef.child("blogs/tests/adapter/deleterecord/normalized/users/" + userId);
        Ember.RSVP.Promise.cast(newUser.get("posts")).then(function(posts) {
          posts.pushObject(newPost);
          newUser.save().then(function() {
            done();
          });
        });
      });
    });

    it("removes entries from inverse (hasMany) side", function(done) {
      newPost.destroyRecord().then(function () {
        userRef.once('value', function(snapshot) {
          var userData = snapshot.val();
          assert(typeof userData.posts === 'undefined');
          done();
        });
      });
    });

    afterEach(function(done) {
      adapter._ref = _ref;
      done();
    });

  });

});
