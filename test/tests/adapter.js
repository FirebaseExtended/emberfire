/*global describe, before, beforeEach, after, afterEach, specify, it, assert, App, FirebaseTestRef, TestHelpers */

describe("FirebaseAdapter - Finding Records", function() {

  var store, serializer, adapter;

  var setupAdapter = function() {
    App.ApplicationAdapter = DS.FirebaseAdapter.extend({
      firebase: FirebaseTestRef.child("blogs/normalized"),
      _queueFlushDelay: 0
    });
    store = App.__container__.lookup("store:main");
    serializer = App.__container__.lookup("serializer:-firebase");
    adapter = App.__container__.lookup("adapter:application");
  };


  after(function() {
    App.reset();
  });

  describe("#init()", function() {
    before(function() {
      setupAdapter();
    });

    it("has a Firebase ref", function() {
      assert(adapter._ref !== undefined);
      assert(adapter._ref.toString().match(/^https\:\/\/emberfire\-demo\.firebaseio\.com/g));
    });

  });

  describe("#_getRef()", function() {
    before(function() {
      setupAdapter();
    });

    it("returns the correct Firebase ref for a type", function() {
      var ref = adapter._getRef(store.modelFor("post"));
      assert(ref.toString().match(/blogs\/normalized\/posts$/g));
    });

    it("returns the correct Firebase ref for a type and id", function() {
      var ref = adapter._getRef(store.modelFor("post"), "post_1");
      assert(ref.toString().match(/blogs\/normalized\/posts\/post_1$/g));
    });

  });


  describe("#find()", function() {

    var getRefSpy, find, findRef;

    before(function() {
      setupAdapter();
      getRefSpy = sinon.spy(adapter, "_getRef");
      find = adapter.find(store, store.modelFor("post"), "post_1");
      findRef = getRefSpy.getCall(0).returnValue;
    });

    it("creates a single Firebase reference", function() {
      assert(getRefSpy.calledOnce);
    });

    it("creates the correct Firebase reference", function() {
      assert(findRef.toString().match(/blogs\/normalized\/posts\/post_1$/g));
    });

    it("returns an object", function() {
      assert.equal(typeof find, "object");
    });

    it("returns a promise", function() {
      assert.equal(typeof find.then, "function");
    });

    it("resolves with the correct payload", function(done) {
      Ember.run(function() {
        find.then(function(payload) {
          assert.equal(payload.id, "post_1");
          done();
        });
      });
    });

    it("throws an error for records that don't exist", function(done) {
      Ember.run(function() {
        adapter.find(store, store.modelFor("post"), "foobar").then(function() {}, function(error) {
          assert(error instanceof Error);
          done();
        });
      });
    });

    after(function() {
      getRefSpy.restore();
    });

  });

  describe("#findAll()", function() {

    var getRefSpy, findAllAddEventListenersSpy, handleChildValueSpy;
    var findAll, findAllRef;
    var Post;

    before(function(done) {
      setupAdapter();
      Post = TestHelpers.getModelName('Post');
      App[Post] = App.Post.extend({
        comments: DS.hasMany("comment", { async: true })
      });
      getRefSpy = sinon.spy(adapter, "_getRef");
      findAllAddEventListenersSpy = sinon.spy(adapter, "_findAllAddEventListeners");
      handleChildValueSpy = sinon.spy(adapter, "_handleChildValue");
      Ember.run(function() {
        findAll = adapter.findAll(store, store.modelFor("post"));
        findAllRef = getRefSpy.getCall(0).returnValue;
        done();
      });
    });

    it("creates the correct Firebase reference", function() {
      assert(findAllRef.toString().match(/blogs\/normalized\/posts$/g));
    });

    it("returns an object", function() {
      assert.equal(typeof findAll, "object");
    });

    it("returns a promise", function() {
      assert.equal(typeof findAll.then, "function");
    });

    it("resolves with the correct payload", function(done) {
      Ember.run(function() {
        findAll.then(function(payload) {
          assert(Ember.isArray(payload));
          assert.equal(payload.length, 2);
          done();
        });
      });
    });

    /*
    it("only adds event listeners once per type", function(done) {
      adapter.findAll(store, store.modelFor("post")).then(function() {
        assert.equal(findAllAddEventListenersSpy.callCount, 1);
        done();
      });
    });*/

    it("adds new child values to the store", function() {
        Ember.run(function(){
          findAllRef.child('post_3').set({
            "published": 1395162147646,
            "body": "This is the third FireBlog post!",
            "title": "Post 3"
          });
        });
        assert(store.hasRecordForId('post', 'post_3'));
    });

    it("handles empty collections", function(done) {
      Ember.run(function() {
        adapter.findAll(store, store.modelFor(Post)).then(function(posts) {
          assert(Ember.isArray(posts));
          done();
        });
      });
    });

    after(function(done) {
      getRefSpy.restore();
      findAllAddEventListenersSpy.restore();
      handleChildValueSpy.restore();
      done();
    });
  });
});
