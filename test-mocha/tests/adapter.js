/*global describe, before, beforeEach, after, afterEach, specify, it, assert, App, FirebaseTestRef, TestHelpers */

describe("FirebaseAdapter", function() {

  var store, serializer, adapter;

  before(function() {
    App.ApplicationAdapter = DS.FirebaseAdapter.extend({
      firebase: FirebaseTestRef.child("blogs/denormalized")
    });
    store = App.__container__.lookup("store:main");
    serializer = App.__container__.lookup("serializer:-firebase");
    adapter = App.__container__.lookup("adapter:application");
  });

  beforeEach(function() {
    App.reset();
  });

  describe("#init()", function() {

    it("has a Firebase ref", function() {
      assert(adapter._ref !== undefined);
      assert.equal(adapter._ref.toString(), "Mock://blogs/denormalized");
    });

  });

  describe("#_getRef()", function() {

    it("returns the correct Firebase ref for a type", function() {
      var ref = adapter._getRef(store.modelFor("post"));
      assert.equal(ref.toString(), "Mock://blogs/denormalized/posts");
    });

    it("returns the correct Firebase ref for a type and id", function() {
      var ref = adapter._getRef(store.modelFor("post"), "post_1");
      assert.equal(ref.toString(), "Mock://blogs/denormalized/posts/post_1");
    });

  });

  describe("#_queueScheduleFlush()", function() {

    var spy;

    before(function() {
      spy = sinon.spy(adapter, "_queueScheduleFlush");
    });

    it("schedules a #_queueFlush()", function(done) {
      adapter._queueScheduleFlush();
      Ember.run.later(this, function() {
        assert.equal(spy.callCount, 1);
        done();
      }, adapter._queueFlushDelay * 2);
    });

    after(function() {
      spy.restore();
    });

  });

  describe("#_enqueue()", function() {

    var queueScheduleFlushSpy, queueFlushSpy, callbackSpy;

    before(function() {
      queueScheduleFlushSpy = sinon.spy(adapter, "_queueScheduleFlush");
      queueFlushSpy = sinon.spy(adapter, "_queueFlush");
      callbackSpy = sinon.spy();
    });

    it("pushes a new item into the _queue", function() {
      adapter._enqueue(callbackSpy, ['foo']);
      assert.equal(adapter._queue.length, 1);
    });

    it("schedules a _queueFlush()", function() {
      assert.equal(queueScheduleFlushSpy.callCount, 1);
    });

    it("flushes the _queue", function(done) {
      Ember.run.later(this, function() {
        assert.equal(queueFlushSpy.callCount, 1);
        done();
      }, adapter._queueFlushDelay * 2);
    });

    it("applys the callback with the correct arguments", function() {
      assert.equal(callbackSpy.callCount, 1);
      assert.equal(callbackSpy.getCall(0).args[0], 'foo');
    });

    after(function() {
      queueScheduleFlushSpy.restore();
      queueFlushSpy.restore();
    });

  });

  describe("#find()", function() {

    var getRefSpy, find, findRef;

    before(function() {
      getRefSpy = sinon.spy(adapter, "_getRef");
      find = adapter.find(store, store.modelFor("post"), "post_1");
      findRef = getRefSpy.getCall(0).returnValue;
    });

    it("creates a single Firebase reference", function() {
      assert(getRefSpy.calledOnce);
    });

    it("creates the correct Firebase reference", function() {
      assert.equal(findRef.toString(), "Mock://blogs/denormalized/posts/post_1");
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

    after(function() {
      getRefSpy.restore();
    });

  });

});