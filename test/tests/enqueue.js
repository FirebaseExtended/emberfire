/*global describe, before, beforeEach, after, afterEach, specify, it, assert, App, FirebaseTestRef, TestHelpers */

describe("FirebaseAdapter - Queing pushes", function() {

  var store, serializer, adapter;

  var setupAdapter = function() {
    App.ApplicationAdapter = DS.FirebaseAdapter.extend({
      firebase: FirebaseTestRef.child("blogs/normalized"),
    });
    store = App.__container__.lookup("store:main");
    serializer = App.__container__.lookup("serializer:-firebase");
    adapter = App.__container__.lookup("adapter:application");
  };


  afterEach(function() {
    App.reset();
  });

  describe("#_queueScheduleFlush()", function() {

    var spy;

    before(function() {
      setupAdapter();
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
      setupAdapter();
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
});
