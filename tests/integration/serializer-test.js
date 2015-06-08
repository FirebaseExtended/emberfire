import Ember from 'ember';
import DS from 'ember-data';
import startApp from 'dummy/tests/helpers/start-app';
import { it } from 'ember-mocha';
import sinon from 'sinon';
import stubFirebase from 'dummy/tests/helpers/stub-firebase';
import unstubFirebase from 'dummy/tests/helpers/unstub-firebase';
import createTestRef from 'dummy/tests/helpers/create-test-ref';
import snapshotToArray from 'dummy/tests/helpers/snapshot-to-array';
import defineModel from 'dummy/tests/helpers/define-model';

describe("Integration: FirebaseSerializer", function() {
  var app, store, serializer, firebaseTestRef;

  beforeEach(function() {
    stubFirebase();
    app = startApp();
    firebaseTestRef = createTestRef();
    store = app.__container__.lookup("service:store");
    serializer = store.serializerFor('post');
  });

  afterEach(function() {
    unstubFirebase();
    Ember.run(app, 'destroy');
  });

  describe("#normalize()", function() {

    describe("normalized payload", function() {

      var posts, normalizedPayload, comments;

      beforeEach(function(done) {
        firebaseTestRef
          .child("blogs/normalized/posts")
          .once("value", function(snapshot) {
            posts = snapshotToArray(snapshot);
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

      var posts, normalizedPayload, comments;

      beforeEach(function(done) {
        defineModel(app, 'post2', {
          title: DS.attr('string'),
          comments: DS.hasMany('comment', { async: false, embedded: true })
        });
        firebaseTestRef
          .child("blogs/denormalized/posts")
          .once("value", function(snapshot) {
            posts = snapshotToArray(snapshot);
            Ember.run(function() {
              normalizedPayload = serializer.normalize(store.modelFor('post2'), posts[0]);
              comments = normalizedPayload.comments;
              done();
            });
          });
      });

      it("pushed the embedded records into the store", function() {
        var hasComments = function(ids) {
          return Ember.A(ids).every(function(id) {
            return store.hasRecordForId("comment", id);
          });
        };
        assert(hasComments(["comment_1", "comment_2"]), 'embedded records not found in store');
      });

    });

    describe("invalid payload", function() {

      var posts;

      beforeEach(function(done) {
        firebaseTestRef
          .child("blogs/invalid/posts")
          .once("value", function(snapshot) {
            posts = snapshotToArray(snapshot);
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

      beforeEach(function(done) {
        spy = sinon.spy(serializer, "extractSingle");
        firebaseTestRef
          .child("blogs/normalized/posts")
          .once("value", function(snapshot) {
            posts = snapshotToArray(snapshot);
            extractedArray = serializer.extractArray(store, store.modelFor("post"), posts);
            done();
          });
      });

      it("was called for each item in the payload", function() {
        assert.equal(spy.callCount, posts.length);
      });

      afterEach(function() {
        spy.restore();
      });

    });

    describe("denormalized payload", function() {

      var posts, spy, extractedArray;

      beforeEach(function(done) {

        defineModel(app, 'post2', {
          title: DS.attr('string'),
          comments: DS.hasMany("comment", { async: false, embedded: true })
        });

        spy = sinon.spy(serializer, "extractSingle");
        firebaseTestRef
          .child("blogs/denormalized/posts")
          .once("value", function(snapshot) {
            posts = snapshotToArray(snapshot);
            Ember.run(function() {
              extractedArray = serializer.extractArray(store, store.modelFor('post2'), posts);
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
            return store.hasRecordForId("comment", id);
          });
        };
        assert(hasComments(["comment_1", "comment_2"]), 'embedded records not found in store');
      });

      afterEach(function() {
        spy.restore();
      });

    });

  });


  describe("#extractArray()", function() {

    describe("normalized payload", function() {

      var posts, spy, extractedArray;

      beforeEach(function(done) {
        spy = sinon.spy(serializer, "extractArray");
        firebaseTestRef
          .child("blogs/normalized/posts")
          .once("value", function(snapshot) {
            posts = snapshotToArray(snapshot);
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

      afterEach(function() {
        spy.restore();
      });

    });

  });

  // TODO: make this work
  /*describe("#serializeHasMany()", function() {

    describe("normalized payload", function() {

      var json, relationship, serializedRecord, posts, comments;

      beforeEach(function(done) {
        Ember.run(function() {
          var post = store.createRecord("post", {
            id: "post_a",
            title: "My Post"
          });
          store.push("user", {
            id: "user_a",
            posts: ["post_a"]
          });
          var user = store.peekRecord("user", "user_a");
          var json = {};

          relationship = Ember.get(store.modelFor("user"), "relationshipsByName").get("posts");
          serializer.serializeHasMany(user, json, relationship);

          store.findRecord("user", "aputinski").then(function(record) {
            Ember.run(function() {
            record.get('posts').then(function(foo) {
              console.log(foo.getObject(0));
            }, function(er) {
              console.log('THERE WAS AN ER');
            });
            });
            console.log(store.hasRecordForId("user", "aputinski"));
            json = {};
            serializer.serializeHasMany(user, json, relationship);
            posts = Ember.A(json.posts);
          //});
        });
      });

      it("serializes hasMany relationships", function() {
        assert(Ember.isArray([]));
        //assert(posts.contains("post_1") && posts.contains("post_2"));
      });

    });

  });*/

});
