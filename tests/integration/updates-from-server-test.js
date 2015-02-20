/*global describe, before, beforeEach, after, afterEach, specify, it, assert, App, FirebaseTestRef, TestHelpers */


describe("FirebaseAdapter - Updates from server", function() {
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

  describe("A newly created record is updated correctly after saving", function() {
    var _ref, newPost, postId;

    before(function(done) {
      setupAdapter();
      _ref = adapter._ref;
      var reference = FirebaseTestRef.child("blogs/tests/adapter/updaterecord/normalized");
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

    it("updates the post correctly", function() {
      assert(newPost.get('title') === 'Updated');
    });

    after(function(done) {
      adapter._ref = _ref;
      done();
    });

  });

  describe("A record coming from find, gets the updates from the server correctly", function() {
    var _ref, newPost, postId;

    before(function(done) {
      setupAdapter();
      _ref = adapter._ref;
      var reference = FirebaseTestRef.child("blogs/normalized");
      adapter._ref = reference;
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
      assert(newPost.get('body') === 'Updated');
    });

    after(function(done) {
      adapter._ref = _ref;
      done();
    });

  });

  describe("An embedded record coming from the server, gets the updates correctly", function() {
    var _ref, newPost, postId, postClassName, postRefName, comment;

    before(function(done) {
      setupAdapter();
      _ref = adapter._ref;
      var reference = FirebaseTestRef.child("blogs/double_denormalized");
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

    it("updates the comment correctly", function() {
      assert(comment.get('body') === 'Updated');
    });

    after(function(done) {
      adapter._ref = _ref;
      done();
    });

  });

  describe("Embedded record has transforms applied correctly, issue #88", function() {
    var _ref, newPost, postId, postClassName, postRefName, comment;

    before(function(done) {
      setupAdapter();
      _ref = adapter._ref;
      var reference = FirebaseTestRef.child("blogs/double_denormalized");
      adapter._ref = reference;
      Ember.run(function() {
        store.find("post", 'post_1').then(function(post) {
          comment = post.get('embeddedComments').objectAt(0);
          done();
        });
      });
    });

    it("Published transformed to a number", function() {
      assert(typeof comment.get('published')  === 'number');
    });

    after(function(done) {
      adapter._ref = _ref;
      done();
    });

  });

  describe("Double embedded records are loaded correctly", function() {
    var _ref, newPost, postId, postClassName, postRefName, user;

    before(function(done) {
      setupAdapter();
      _ref = adapter._ref;
      var reference = FirebaseTestRef.child("blogs/double_denormalized");
      adapter._ref = reference;
      Ember.run(function() {
        store.find("post", 'post_1').then(function(post) {
          user = post.get('embeddedComments').objectAt(0).get('embeddedUser');
          done();
        });
      });
    });

    it("doubly embedded user is loaded correctly", function() {
      assert(user.get('firstName') === 'Adam');
    });

    after(function(done) {
      adapter._ref = _ref;
      done();
    });
  });

  describe("Setting a belongsTo to null, wipes it from the server as well issue #103", function() {
    var _ref, newPost, postId, commentData, postRefName, user;

    before(function(done) {
      setupAdapter();
      _ref = adapter._ref;
      var reference = FirebaseTestRef.child("blogs/normalized");
      adapter._ref = reference;
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

    after(function(done) {
      adapter._ref = _ref;
      done();
    });
  });

  describe("Deleting a record serverside, deletes it client side as well", function() {
    var _ref, currentComment, postId, commentData, postRefName, user;

    before(function(done) {
      setupAdapter();
      _ref = adapter._ref;
      var reference = FirebaseTestRef.child("blogs/normalized");
      adapter._ref = reference;
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

    after(function(done) {
      adapter._ref = _ref;
      done();
    });
  });

  describe("Deleting a record clientside, deletes it on the server side as well", function() {
    var _ref, reference, postId, commentData, postRefName, user;

    before(function(done) {
      setupAdapter();
      _ref = adapter._ref;
      reference = FirebaseTestRef.child("blogs/normalized");
      adapter._ref = reference;
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

    after(function(done) {
      adapter._ref = _ref;
      done();
    });
  });

 describe("Editing a found record clientside, edits it on the server side as well", function() {
    var _ref, reference, postId, commentData, postRefName, user;

    before(function(done) {
      setupAdapter();
      _ref = adapter._ref;
      reference = FirebaseTestRef.child("blogs/normalized");
      adapter._ref = reference;
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

    after(function(done) {
      adapter._ref = _ref;
      done();
    });
  });
});

