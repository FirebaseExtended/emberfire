import Ember from 'ember';
import DS from 'ember-data';
import startApp from 'dummy/tests/helpers/start-app';
import { it } from 'ember-mocha';
import stubFirebase from 'dummy/tests/helpers/stub-firebase';
import unstubFirebase from 'dummy/tests/helpers/unstub-firebase';
import createTestRef from 'dummy/tests/helpers/create-test-ref';

describe("Integration: FirebaseAdapter - Updates from server", function() {
  var app, store, adapter, firebaseTestRef;

  var setupAdapter = function() {
    app = startApp();

    firebaseTestRef = createTestRef();
    store = app.__container__.lookup("store:main");
    adapter = store.adapterFor('application');
    adapter._ref = createTestRef("blogs/normalized");
    adapter._queueFlushDelay = false;

    // needs a better way that uses the container
    app.Post = DS.Model.extend({
      title: DS.attr('string'),
      body: DS.attr('string'),
      published: DS.attr('number'),
      publishedDate: Ember.computed('published', function() {
        return this.get('published');
      }),
      user: DS.belongsTo('user', { async: true }),
      comments: DS.hasMany('comment', { async: true }),
      embeddedComments: DS.hasMany('comment', { embedded: true })
    });

    app.Comment = DS.Model.extend({
      body: DS.attr('string'),
      published: DS.attr('number'),
      publishedDate: Ember.computed('published', function() {
        return this.get('published');
      }),
      user: DS.belongsTo('user', { async: true }),
      embeddedUser: DS.belongsTo('user', { embedded: true, inverse:null })
    });
  };

  beforeEach(function () {
    stubFirebase();
    setupAdapter();
  });

  afterEach(function() {
    unstubFirebase();
    delete app.Post;
    delete app.Comment;
    Ember.run(app, 'destroy');
  });

  describe("A locally created record is updated correctly after saving", function() {
    var _ref, newPost, postId;

    beforeEach(function(done) {
      _ref = adapter._ref;
      var reference = firebaseTestRef.child("blogs/tests/adapter/updaterecord/normalized");
      adapter._ref = reference;
      Ember.run(function() {
        newPost = store.createRecord("post", {
          title: "New Post"
        });
        postId = newPost.get('id');
        newPost.save().then(function() {
          reference.child('posts').child(postId).child('title').set('Updated', function() {
            done();
          });
        });
      });
    });

    afterEach(function() {
      adapter._ref = _ref;
    });

    it("updates the post correctly", function() {
      assert(newPost.get('title') === 'Updated', 'property should change');
    });

  });

  describe("A record coming from find, gets the updates from the server correctly", function() {
    var newPost;

    beforeEach(function(done) {
      var reference = adapter._ref;
      Ember.run(function() {
        store.find("post", 'post_1').then(function(post) {
          newPost = post;
          reference.child('posts/post_1/body').set('Updated', function() {
            done();
          });
        });
      });
    });

    it("updates the post correctly", function() {
      assert(newPost.get('body') === 'Updated', 'property should change');
    });
  });

  describe("An embedded record coming from the server, gets the updates correctly", function() {
    var _ref, comment;

    beforeEach(function(done) {
      _ref = adapter._ref;
      var reference = firebaseTestRef.child("blogs/double_denormalized");
      adapter._ref = reference;
      Ember.run(function() {
        store.find("post", 'post_1').then(function(post) {
          comment = post.get('embeddedComments').objectAt(0);
          reference.child('posts/post_1/embeddedComments/comment_1/body').set('Updated', function() {
            done();
          });
        });
      });
    });

    afterEach(function() {
      adapter._ref = _ref;
    });

    it("updates the comment correctly", function() {
      assert(comment.get('body') === 'Updated', 'property should change');
    });

  });

  describe("Embedded record has transforms applied correctly, issue #88", function() {
    var _ref, comment;

    beforeEach(function(done) {
      _ref = adapter._ref;
      var reference = firebaseTestRef.child("blogs/double_denormalized");
      adapter._ref = reference;
      Ember.run(function() {
        store.find("post", 'post_1').then(function(post) {
          comment = post.get('embeddedComments').objectAt(0);
          done();
        });
      });
    });

    afterEach(function() {
      adapter._ref = _ref;
    });

    it("Published transformed to a number", function() {
      assert(typeof comment.get('published')  === 'number');
    });

  });

  describe("Double embedded records are loaded correctly", function() {
    var _ref, user;

    beforeEach(function(done) {
      _ref = adapter._ref;
      var reference = firebaseTestRef.child("blogs/double_denormalized");
      adapter._ref = reference;
      Ember.run(function() {
        store.find("post", 'post_1').then(function(post) {
          user = post.get('embeddedComments').objectAt(0).get('embeddedUser');
          done();
        });
      });
    });

    afterEach(function() {
      adapter._ref = _ref;
    });

    it("doubly embedded user is loaded correctly", function() {
      assert(user.get('firstName') === 'Adam');
    });

  });

  describe("Setting a belongsTo to null, wipes it from the server as well issue #103", function() {
    var commentData;

    beforeEach(function(done) {
      var reference = adapter._ref;
      Ember.run(function() {
        store.find("comment", 'comment_1').then(function(comment) {
          comment.set('user', null);
          comment.save().then(function(){
            reference.child('comments/comment_1').once('value', function(data) {
              commentData = data.val();
              done();
            });
          });
        });
      });
    });

    it("Removed the user from the server", function() {
      assert(!commentData.user);
    });
  });

  describe("Deleting a record serverside, deletes it client side as well", function() {
    var currentComment;

    beforeEach(function(done) {
      var reference = adapter._ref;
      Ember.run(function() {
        store.find("comment", 'comment_1').then(function(comment) {
          currentComment = comment;
          reference.child('comments/comment_1').set(null, function() {
            done();
          });
        });
      });
    });

    it("Comment was deleted client side as well", function() {
      assert(currentComment.get('isDeleted'));
    });
  });

  describe("hasMany relationships", function() {
    var _ref, currentPost, reference;

    beforeEach(function(done) {
      setupAdapter();
      _ref = adapter._ref;
      reference = firebaseTestRef.child("blogs/normalized");
      adapter._ref = reference;
      Ember.run(function() {
        store.find("post", 'post_1').then(function(post) {
          currentPost = post;
          done();
        });
      });
    });


    it("removes the correct client side association when removed on server", function(done) {
      assert(currentPost.get('comments.length') === 2, 'should have 2 related comments');
      Ember.run(function () {
        reference.child('posts/post_1/comments/comment_1').remove(function() {
          assert(currentPost.get('comments.firstObject.id') === 'comment_2', 'only comment_2 should remain');
          done();
        });
      });
    });

    it("removes all client side associations when entire property is removed", function(done) {
      assert(currentPost.get('comments.length') === 2, 'should have 2 related comments');
      Ember.run(function () {
        reference.child('posts/post_1/comments').remove(function() {
          assert(currentPost.get('comments.length') === 0, 'all related comments should be removed');
          done();
        });
      });
    });

    after(function(done) {
      adapter._ref = _ref;
      done();
    });
  });

describe("belongsTo relationships", function() {
    var _ref, currentComment, reference;

    beforeEach(function(done) {
      setupAdapter();
      _ref = adapter._ref;
      reference = firebaseTestRef.child("blogs/normalized");
      adapter._ref = reference;
      Ember.run(function() {
        store.find("comment", 'comment_1').then(function(comment) {
          currentComment = comment;
          done();
        });
      });
    });


    it("removes the client side association when removed on server", function(done) {
      assert(currentComment.get('user.id'), 'should have a user');
      Ember.run(function () {
        reference.child('comments/comment_1/user').remove(function() {
          assert(currentComment.get('user'), 'user association should be missing');
          done();
        });
      });
    });

    after(function(done) {
      adapter._ref = _ref;
      done();
    });
  });

  describe("Deleting a record clientside, deletes it on the server side as well", function() {
    var reference;

    beforeEach(function(done) {
      reference = adapter._ref;
      Ember.run(function() {
        store.find("comment", 'comment_2').then(function(comment) {
          comment.destroyRecord().then(function() {
            done();
          });
        });
      });
    });

    it("Comment was deleted server side as well", function(done) {
      reference.child('comments/comment_2').once('value', function(data) {
        assert(data.val() === null);
        done();
      });
    });
  });

 describe("Editing a found record clientside, edits it on the server side as well", function() {
    var reference;

    beforeEach(function(done) {
      reference = adapter._ref;
      Ember.run(function() {
        store.find("comment", 'comment_3').then(function(comment) {
          comment.set('body', 'Updated');
          comment.save().then(function() {
            done();
          });
        });
      });
    });

    it("Comment was edited server side as well", function(done) {
      reference.child('comments/comment_3/body').once('value', function(data) {
        assert(data.val() === 'Updated');
        done();
      });
    });
  });
});

