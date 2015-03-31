import Ember from 'ember';
import startApp from 'dummy/tests/helpers/start-app';
import { it } from 'ember-mocha';
import stubFirebase from 'dummy/tests/helpers/stub-firebase';
import unstubFirebase from 'dummy/tests/helpers/unstub-firebase';
import createTestRef from 'dummy/tests/helpers/create-test-ref';

describe("Integration: FirebaseAdapter - Deleting records", function() {
  var app, store, adapter, firebaseTestRef;

  beforeEach(function () {
    stubFirebase();
    app = startApp();

    firebaseTestRef = createTestRef();
    store = app.__container__.lookup("store:main");
    adapter = store.adapterFor('application');
  });

  afterEach(function() {
    unstubFirebase();
    Ember.run(app, 'destroy');
  });

  describe("when a belongsTo relationship exists", function() {
    var _ref, newPost, newUser, postId, userRef, userId;

    beforeEach(function(done) {
      _ref = adapter._ref;
      var reference = firebaseTestRef.child("blogs/tests/adapter/deleterecord/normalized");
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
        userRef = firebaseTestRef.child("blogs/tests/adapter/deleterecord/normalized/users/" + userId);
        Ember.RSVP.Promise.cast(newUser.get("posts")).then(function(posts) {
          posts.pushObject(newPost);
          newUser.save().then(function() {
            done();
          });
        });
      });
    });

    afterEach(function() {
      adapter._ref = _ref;
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

  });

});
