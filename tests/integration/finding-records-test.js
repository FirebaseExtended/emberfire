import Ember from 'ember';
import startApp from 'dummy/tests/helpers/start-app';
import { it } from 'ember-mocha';
import sinon from 'sinon';
import stubFirebase from 'dummy/tests/helpers/stub-firebase';
import unstubFirebase from 'dummy/tests/helpers/unstub-firebase';
import createTestRef from 'dummy/tests/helpers/create-test-ref';

describe("Integration: FirebaseAdapter - Finding Records", function() {
  var app, store, adapter;

  beforeEach(function() {
    stubFirebase();

    app = startApp();

    store = app.__container__.lookup("store:main");
    adapter = store.adapterFor('application');
    adapter._ref = createTestRef("blogs/normalized");
    adapter._queueFlushDelay = false;
  });

  afterEach(function() {
    unstubFirebase();
    Ember.run(app, 'destroy');
  });

  describe("#init()", function() {
    it("has a Firebase ref", function() {
      assert(adapter._ref !== undefined);
      assert(adapter._ref.toString().match(/^https\:\/\/emberfire\-demo\.firebaseio\.com/g));
    });

  });

  describe("#_getRef()", function() {
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

    var getRefSpy, findPromise, findRef;

    beforeEach(function(done) {
      getRefSpy = sinon.spy(adapter, "_getRef");
      Ember.run(function () {
        findPromise = adapter.find(store, store.modelFor("post"), "post_1");

        findPromise.then(() => {
          findRef = getRefSpy.getCall(0).returnValue;
          done();
        });
      });
    });

    afterEach(function() {
      getRefSpy.restore();
    });

    it("creates a single Firebase reference", function() {
      assert(getRefSpy.calledOnce);
    });

    it("creates the correct Firebase reference", function() {
      assert(findRef.toString().match(/blogs\/normalized\/posts\/post_1$/g));
    });

    it("returns an object", function() {
      assert.equal(typeof findPromise, "object");
    });

    it("returns a promise", function() {
      assert.equal(typeof findPromise.then, "function");
    });

    it("resolves with the correct payload", function(done) {
      Ember.run(function() {
        findPromise.then(function(payload) {
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
  });

  describe("#findQuery()", function() {
    var getRefSpy, findQueryPromise, findQueryRef, recordArray;

    beforeEach(function(done) {
      recordArray = store.recordArrayManager
        .createAdapterPopulatedRecordArray(store.modelFor('post'), null);
      getRefSpy = sinon.spy(adapter, "_getRef");
      Ember.run(function () {
        findQueryPromise = adapter.findQuery(store, store.modelFor("post"), {
          limit: 2
        }, recordArray);

        findQueryPromise.then(() => {
          findQueryRef = getRefSpy.getCall(0).returnValue;
          done();
        });
      });
    });

    afterEach(function() {
      getRefSpy.restore();
    });

    it("creates the correct Firebase reference", function() {
      assert(findQueryRef.toString().match(/blogs\/normalized\/posts$/g));
    });

    it("returns an object", function() {
      assert.equal(typeof findQueryPromise, "object");
    });

    it("returns a promise", function() {
      assert.equal(typeof findQueryPromise.then, "function");
    });

    it("resolves with the correct payload", function(done) {
      Ember.run(function() {
        findQueryPromise.then(function(payload) {
          assert(Ember.isArray(payload));
          // This should equal 2 - mockfirebase does not implement #limit yet
          assert.equal(payload.length, 3);
          done();
        });
      });
    });
  });

  describe("#findAll()", function() {

    var getRefSpy, findAllAddEventListenersSpy, handleChildValueSpy;
    var findAllPromise, findAllRef;

    beforeEach(function(done) {
      getRefSpy = sinon.spy(adapter, "_getRef");
      findAllAddEventListenersSpy = sinon.spy(adapter, "_findAllAddEventListeners");
      handleChildValueSpy = sinon.spy(adapter, "_handleChildValue");

      Ember.run(function () {
        findAllPromise = adapter.findAll(store, store.modelFor("post"));

        findAllPromise.then(() => {
          findAllRef = getRefSpy.getCall(0).returnValue;
          done();
        });
      });
    });

    afterEach(function() {
      getRefSpy.restore();
      findAllAddEventListenersSpy.restore();
      handleChildValueSpy.restore();
    });

    it("creates the correct Firebase reference", function() {
      assert(findAllRef.toString().match(/blogs\/normalized\/posts$/g));
    });

    it("returns an object", function() {
      assert.equal(typeof findAllPromise, "object");
    });

    it("returns a promise", function() {
      assert.equal(typeof findAllPromise.then, "function");
    });

    it("resolves with the correct payload", function(done) {
      Ember.run(function() {
        findAllPromise.then(function(payload) {
          assert(Ember.isArray(payload));
          assert.equal(payload.length, 3);
          done();
        });
      });
    });

    it("only adds event listeners once per type", function(done) {
      adapter.findAll(store, store.modelFor("post")).then(function() {
        assert.equal(findAllAddEventListenersSpy.callCount, 1);
        done();
      });
    });

    it("adds new child values to the store", function() {
      Ember.run(function(){
        findAllRef.child('post_3').set({
          published: 1395162147646,
          body: "This is the third FireBlog post!",
          title: "Post 3"
        });
      });
      assert(store.hasRecordForId(store.modelFor('post'), 'post_3'));
    });

    it("handles empty collections", function(done) {
      Ember.run(function() {
        adapter.findAll(store, store.modelFor("post")).then(function(posts) {
          assert(Ember.isArray(posts));
          done();
        });
      });
    });
  });
});
