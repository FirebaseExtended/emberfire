import Ember from 'ember';
import DS from 'ember-data';
import startApp from 'dummy/tests/helpers/start-app';
import { it } from 'ember-mocha';
import sinon from 'sinon';
import Firebase from 'firebase';
import createTestRef from 'dummy/tests/helpers/create-test-ref';
import createTestAdapter from 'dummy/tests/helpers/create-test-adapter';
import getPosts from 'dummy/tests/helpers/get-posts';
import getModelName from 'dummy/tests/helpers/get-model-name';

describe("Integration: FirebaseSerializer", function() {
  var App, store, serializer, adapter, firebaseTestRef;

  before(function() {
    App = startApp();

    App.ApplicationAdapter = createTestAdapter();

    firebaseTestRef = createTestRef();
    Firebase.goOffline();
    store = App.__container__.lookup("store:main");
    serializer = App.__container__.lookup("serializer:-firebase");
    adapter = App.__container__.lookup("adapter:application");
    adapter._ref = firebaseTestRef.child("blogs/normalized");

    App.Post = DS.Model.extend({
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

    App.Comment = DS.Model.extend({
      body: DS.attr('string'),
      published: DS.attr('number'),
      publishedDate: Ember.computed('published', function() {
        return this.get('published');
      }),
      user: DS.belongsTo('user', { async: true }),
      embeddedUser: DS.belongsTo('user', { embedded: true, inverse:null })
    });

    App.User = DS.Model.extend({
      created: DS.attr('number'),
      username: Ember.computed('id', function() {
        return this.get('id');
      }),
      firstName: DS.attr('string'),
      avatar: Ember.computed(function() {
        return 'https://www.gravatar.com/avatar/' + md5(this.get('id')) + '.jpg?d=retro&size=80';
      }),
      posts: DS.hasMany('post', { async: true }),
      comments: DS.hasMany('comment', { async: true, inverse:'user' })
    });
  });

  after(function() {
    Ember.run(App, 'destroy');
  });

  describe("#normalize()", function() {

    describe("normalized payload", function() {

      var posts, normalizedPayload, comments;

      before(function(done) {
        firebaseTestRef
          .child("blogs/normalized/posts")
          .on("value", function(snapshot) {
            posts = getPosts(snapshot);
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
        Post = getModelName('Post');
        App[Post] = App.Post.extend({
          comments: DS.hasMany("comment", { embedded: true })
        });
        firebaseTestRef
          .child("blogs/denormalized/posts")
          .on("value", function(snapshot) {
            posts = getPosts(snapshot);
            Ember.run(function() {
              normalizedPayload = serializer.normalize(store.modelFor(Post), posts[0]);
              comments = normalizedPayload.comments;
              done();
            });
          });
      });

    });

    describe("invalid payload", function() {

      var posts;

      before(function(done) {
        firebaseTestRef
          .child("blogs/invalid/posts")
          .on("value", function(snapshot) {
            posts = getPosts(snapshot);
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
        firebaseTestRef
          .child("blogs/normalized/posts")
          .on("value", function(snapshot) {
            posts = getPosts(snapshot);
            spy = sinon.spy(serializer, "extractSingle");
            extractedArray = serializer.extractArray(store, store.modelFor("post"), posts);
            done();
          });
      });

      it("was called for each item in the payload", function() {
        assert.equal(spy.callCount, posts.length);
      });

      after(function() {
        spy.restore();
      });

    });

    describe("denormalized payload", function() {

      var Post, posts, spy, extractedArray;

      before(function(done) {
        Post = getModelName('Post');
        App[Post] = App.Post.extend({
          comments: DS.hasMany("comment", { embedded: true })
        });
        firebaseTestRef
          .child("blogs/denormalized/posts")
          .on("value", function(snapshot) {
            posts = getPosts(snapshot);
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
            return store.hasRecordForId("comment", id);
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
        firebaseTestRef
          .child("blogs/normalized/posts")
          .on("value", function(snapshot) {
            posts = getPosts(snapshot);
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

  // TODO: make this work
  /*describe("#serializeHasMany()", function() {

    describe("normalized payload", function() {

      var json, relationship, serializedRecord, posts, comments;

      before(function(done) {
        Ember.run(function() {
          var post = store.createRecord("post", {
            id: "post_a",
            title: "My Post"
          });
          store.push("user", {
            id: "user_a",
            posts: ["post_a"]
          });
          var user = store.getById("user", "user_a");
          var json = {};

          relationship = Ember.get(store.modelFor("user"), "relationshipsByName").get("posts");
          serializer.serializeHasMany(user, json, relationship);

          store.find("user", "aputinski").then(function(record) {
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
