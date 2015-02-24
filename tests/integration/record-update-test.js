import Ember from 'ember';
import DS from 'ember-data';
import startapp from 'dummy/tests/helpers/start-app';
import { it } from 'ember-mocha';
import stubFirebase from 'dummy/tests/helpers/stub-firebase';
import unstubFirebase from 'dummy/tests/helpers/unstub-firebase';
import createTestRef from 'dummy/tests/helpers/create-test-ref';
import reopenModel from 'dummy/tests/helpers/reopen-model';

describe("Integration: FirebaseAdapter - Updating records", function() {
  var app, store, adapter;

  var setupAdapter = function() {
    app = startapp();
    store = app.__container__.lookup("store:main");
    adapter = app.__container__.lookup("adapter:application");
    adapter._ref = createTestRef("blogs/normalized");
    adapter._queueFlushDelay = false;
  };

  before(function () {
    stubFirebase();
  });

  after(function () {
    unstubFirebase();
  });


  afterEach(function() {
    Ember.run(app, 'destroy');
  });

  describe("#updateRecord()", function() {

    describe("normalized relationship", function() {
      var _ref, newPost, newComment, currentData, postData, postId, commentId;

      before(function(done) {
        setupAdapter();
        _ref = adapter._ref;
        var reference = createTestRef("blogs/tests/adapter/updaterecord/normalized");
        adapter._ref = reference;
        Ember.run(function() {
          newComment = store.createRecord("comment", {
            body: "This is a new comment"
          });
          newPost = store.createRecord("post", {
            title: "New Post"
          });
          postId = newPost.get('id');
          commentId = newComment.get('id');
          Ember.RSVP.Promise.cast(newPost.get("comments")).then(function(comments) {
            comments.pushObject(newComment);
            newPost.save().then(function() {
              reference.once('value', function(data) {
                currentData = data.val();
                postData = currentData.posts[postId];
                done();
               });
            });
          });
        });
      });

      it("contains a hasMany relationship", function() {
        assert(postData.comments[commentId] === true);
        assert(Ember.isArray(postData.comments) === false);
      });

      it("removed the null belongsTo reference from the final payload", function() {
        assert(postData.user === undefined);
      });

      after(function(done) {
        adapter._ref = _ref;
        done();
      });

    });

    describe("relationships with number ids", function() {
      var _ref, newPost, newComment, postId, commentId;

      before(function(done) {
        setupAdapter();
        _ref = adapter._ref;
        var reference = createTestRef("blogs/tests/adapter/updaterecord/normalized");
        adapter._ref = reference;
        Ember.run(function() {
          newComment = store.createRecord("comment", {
            id: 1,
            body: "This is a new comment"
          });
          newPost = store.createRecord("post", {
            title: "New Post"
          });
          postId = newPost.get('id');
          commentId = newComment.get('id');
          newComment.save();
          Ember.RSVP.all([newComment.save(), newPost.get("comments")]).then(function(promises) {
            var comments = promises[1];
            comments.pushObject(newComment);
            newPost.save().then(function() {
              return newPost.reload().then(function() {
                done();
              });
            });
          });
        });
      });

      it("contains a hasMany relationship", function(done) {
        newPost.get('comments').then(function(comments) {
          assert(comments.objectAt(0).get('body'), 'This is a new comment');
          done();
        });
      });

      after(function(done) {
        adapter._ref = _ref;
        done();
      });

    });

    describe("multiple normalized relationships", function() {

      var _ref, newPost1, newPost2, newPost3, newComment, newUser;

      before(function(done) {
        setupAdapter();

        reopenModel(app, 'user', {
          comments: DS.hasMany('comment', { async: true, inverse:'user' })
        });

        _ref = adapter._ref;
        adapter._ref = createTestRef("blogs/tests/adapter/updaterecord/normalized");

        Ember.run(function() {
          newUser = store.createRecord("user");
          newComment = store.createRecord("comment", {
            body: "This is a new comment"
          });
          newPost1 = store.createRecord("post", {
            title: "Post 1"
          });
          newPost2 = store.createRecord("post", {
            title: "Post 2"
          });
          newPost3 = store.createRecord("post", {
            title: "Post 3"
          });
          newUser.get("posts").then(function(posts) {
            posts.pushObjects([newPost1, newPost2, newPost3]);
            newUser.save().then(function() {
              return Ember.RSVP.all([newPost1.save(), newPost2.save(), newPost3.save()]);
            }).then(function(){
              done();
            });
          });
        });
      });

      it("adds a comment without removing old posts", function(done) {
        Ember.run(function() {
          newUser.get("comments").then(function(comments) {
            var posts;
            comments.addObject(newComment);
            newUser.save().then(function() {
              return newComment.save();
            }).then(function() {
              return newUser.get('posts').then(function(ps) {
                posts = ps;
              });
            }).then(function() {
              assert(Ember.A(posts).contains(newPost1));
              assert(Ember.A(posts).contains(newPost2));
              assert(Ember.A(posts).contains(newPost3));
              done();
            });
          });
        });
      });

      after(function(done) {
        adapter._ref = _ref;
        done();
      });
    });

    describe("denormalized relationship", function() {

      var _ref, newPost, newComment, currentData, postData, commentData;
      var postId, commentId;

      before(function(done) {
        setupAdapter();
        _ref = adapter._ref;

        reopenModel(app, 'post', {
          comments: DS.hasMany("comment", { embedded: true })
        });

        var reference = createTestRef("blogs/tests/adapter/updaterecord/denormalized");
        adapter._ref = reference;
        Ember.run(function() {
          newComment = store.createRecord("comment", {
            body: "This is a new comment"
          });
          newPost = store.createRecord('post', {
            title: "New Post"
          });
          postId = newPost.get('id');
          commentId = newComment.get('id');
          newPost.get("comments").addObject(newComment);
          newPost.save().then(function() {
            reference.once('value', function(data) {
              currentData = data.val();
              postData = currentData.posts[postId];
              commentData = postData.comments[commentId];
              done();
             });
          });
        });
      });

      it("embedded the comments correctly ", function() {
        assert(commentData.body, "This is a new comment");
      });

      after(function(done) {
        adapter._ref = _ref;
        done();
      });

    });

  });

});
