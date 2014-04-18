/*global describe, before, beforeEach, after, afterEach, specify, it, assert, App, FirebaseTestRef, TestHelpers */

describe("FirebaseSerializer", function() {

  var store, serializer;

  before(function() {
    store = App.__container__.lookup("store:main");
    serializer = App.__container__.lookup("serializer:-firebase");
  });

  beforeEach(function() {
    App.reset();
  });

  describe("#normalize()", function() {

    describe("normalized payload", function() {

      var posts, normalizedPayload, comments;

      before(function(done) {
        FirebaseTestRef
          .child("blogs/normalized/posts")
          .on("value", function(snapshot) {
            posts = TestHelpers.getPosts(snapshot);
            normalizedPayload = serializer.normalize(store.modelFor('post'), posts[0]);
            comments = Ember.A(normalizedPayload.comments);
            done();
          });
      });

      it("converts hasMany relationships to arrays", function() {
        assert(Ember.isArray(comments));
        assert(comments.contains("comment_1") && comments.contains("comment_2"));
      });

    });

    describe("denormalized payload", function() {

      var Post, posts, normalizedPayload, comments;

      before(function(done) {
        Post = TestHelpers.getModelName('Post');
        App[Post] = App.Post.extend({
          comments: DS.hasMany("comment", { embedded: true })
        });
        FirebaseTestRef
          .child("blogs/normalized/posts")
          .on("value", function(snapshot) {
            posts = TestHelpers.getPosts(snapshot);
            normalizedPayload = serializer.normalize(store.modelFor(Post), posts[0]);
            comments = normalizedPayload.comments;
            done();
          });
      });

      it("leaves embedded hasMany relationships as objects", function() {
        assert(!Ember.isArray(comments));
      });

    });

    describe("invalid payload", function() {

      var posts;

      before(function(done) {
        FirebaseTestRef
          .child("blogs/invalid/posts")
          .on("value", function(snapshot) {
            posts = TestHelpers.getPosts(snapshot);
            done();
          });
      });

      it("throws an error for hasMany relationships that come down as an array", function() {
        assert.throws(function() {
          serializer.normalize(store.modelFor("post"), posts[0]);
        });
      });

    });

  });

  describe("#extractSingle()", function() {

    describe("normalized payload", function() {

      var posts, spy, extractedArray;

      before(function(done) {
        FirebaseTestRef
          .child("blogs/normalized/posts")
          .on("value", function(snapshot) {
            posts = TestHelpers.getPosts(snapshot);
            spy = sinon.spy(serializer, "extractSingle");
            extractedArray = serializer.extractArray(store, store.modelFor("post"), posts);
            done();
          });
      });

      it("was called for each item in the payload", function() {
        assert.equal(spy.callCount, 3);
      });

      after(function() {
        spy.restore();
      });

    });

    describe("denormalized payload", function() {

      var Post, posts, spy, extractedArray;

      before(function(done) {
        Post = TestHelpers.getModelName('Post');
        App[Post] = App.Post.extend({
          comments: DS.hasMany("comment", { embedded: true })
        });
        FirebaseTestRef
          .child("blogs/denormalized/posts")
          .on("value", function(snapshot) {
            posts = TestHelpers.getPosts(snapshot);
            spy = sinon.spy(serializer, "extractSingle");
            Ember.run(function() {
              extractedArray = serializer.extractArray(store, store.modelFor(Post), posts);
              done();
            });
          });
      });

      it("was called for each item in the payload", function() {
        assert.equal(spy.callCount, 2);
      });

      it("pushed the embedded records into the store", function() {
        var hasComments = function(ids) {
          return Ember.A(ids).every(function(id) {
            return store.hasRecordForId(store.modelFor("comment"), id);
          });
        };
        assert(hasComments(["comment_1", "comment_2"]));
      });

      after(function() {
        spy.restore();
      });

    });

  });


  describe("#extractArray()", function() {

    describe("normalized payload", function() {

      var posts, spy, extractedArray;

      before(function(done) {
        FirebaseTestRef
          .child("blogs/normalized/posts")
          .on("value", function(snapshot) {
            posts = TestHelpers.getPosts(snapshot);
            spy = sinon.spy(serializer, "extractArray");
            extractedArray = serializer.extractArray(store, store.modelFor("post"), posts);
            done();
          });
      });

      it("was called once", function() {
        assert.equal(spy.callCount, 1);
      });

      it("returns an array", function() {
        assert(Ember.isArray(extractedArray));
      });

      it("the returned array contains the correct number of items", function() {
        assert(extractedArray.length, 2);
      });

      after(function() {
        spy.restore();
      });

    });

  });

});