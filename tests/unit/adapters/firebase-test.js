/* jshint expr:true */
import Ember from 'ember';
import {
  describeModule,
  it
} from 'ember-mocha';

import MockFirebase from 'mock-firebase';
import sinon from 'sinon';

describeModule('adapter:firebase', 'FirebaseAdapter', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  },
  function() {

    describe('#init', function () {

      it('throws an error when the firebase property is not supplied', function() {
        assert.throws(function() {
          this.subject();
        });
      });

    }); // #init

    describe('#applyQueryToRef', function () {
      var mockFirebase, adapter, ref;

      beforeEach(function () {
        mockFirebase = new MockFirebase('https://emberfire-demo.firebaseio.com');
        adapter = this.subject({
          firebase: mockFirebase
        });
        ref = mockFirebase.ref();
        // mock ref doesnt support the new query stuff, yet
        ref.orderByKey = function () { return this; };
        ref.orderByPriority = function () { return this; };
        ref.orderByValue = function () { return this; };
        ref.orderByChild = function () { return this; };
        ref.limitToFirst = function () { return this; };
        ref.limitToLast = function () { return this; };
        ref.startAt = function () { return this; };
        ref.endAt = function () { return this; };
        ref.equalTo = function () { return this; };
      });

      it('defaults to orderByKey when orderBy is not supplied', function () {
        var spy = sinon.spy(ref, 'orderByKey');

        adapter.applyQueryToRef(ref, {});
        assert(spy.calledOnce, 'orderByKey should be called');
      });

      it('defaults to orderByKey when orderBy is an empty string', function () {
        var spy = sinon.spy(ref, 'orderByKey');

        adapter.applyQueryToRef(ref, { orderBy: '' });
        assert(spy.calledOnce, 'orderByKey should be called');
      });

      ['key', 'value', 'priority'].forEach(function (k) {
        var upperK = k.capitalize();

        it(`orderBy: "_${k}" calls orderBy${upperK}`, function () {
          var spy = sinon.spy(ref, 'orderBy' + upperK);

          adapter.applyQueryToRef(ref, { orderBy: '_' + k });
          assert(spy.calledOnce, `orderBy${upperK} should be called`);
        });

      });

      it('orderBy: `x` calls orderByChild(x)', function () {
        var spy = sinon.spy(ref, 'orderByChild');

        adapter.applyQueryToRef(ref, { orderBy: 'x' });
        assert(spy.calledWith('x'), 'orderByChild should be called with `x`');
      });

      ['limitToFirst', 'limitToLast', 'startAt', 'endAt', 'equalTo'].forEach(function (key) {

        it(`calls ${key} and passes through value when specified`, function () {
          var spy = sinon.spy(ref, key);

          var query = {};

          query[key] = 'value';

          adapter.applyQueryToRef(ref, query);
          assert(spy.calledOnce);
          assert(spy.calledWith('value'));
        });

        it(`calls ${key} and passes through value when empty string`, function () {
          var spy = sinon.spy(ref, key);

          var query = {};

          query[key] = '';

          adapter.applyQueryToRef(ref, query);
          assert(spy.calledOnce);
          assert(spy.calledWith(''));
        });

        it(`does not call ${key} when the value is null`, function () {
          var spy = sinon.spy(ref, key);

          var query = {};

          query[key] = null;

          adapter.applyQueryToRef(ref, query);
          assert(spy.called === false, `${key} should not be called`);
        });

      }); // forEach

    }); // #applyQueryToRef

    describe("#_queueScheduleFlush", function() {

      var adapter, spy;

      beforeEach(function() {
        adapter = this.subject({
          firebase: new MockFirebase('https://emberfire-demo.firebaseio.com'),
          _queueFlushDelay: 1
        });
        spy = sinon.spy(adapter, "_queueScheduleFlush");
      });

      afterEach(function() {
        spy.restore();
      });

      it("schedules a #_queueFlush", function(done) {
        adapter._queueScheduleFlush();
        Ember.run.later(this, function() {
          assert.equal(spy.callCount, 1);
          done();
        }, adapter._queueFlushDelay * 2);
      });

    }); // #_queueScheduleFlush

    describe("#_enqueue", function() {
      var adapter, queueScheduleFlushSpy, queueFlushSpy, callbackSpy;

      beforeEach(function() {
        adapter = this.subject({
          firebase: new MockFirebase('https://emberfire-demo.firebaseio.com'),
          _queueFlushDelay: 1
        });
        queueScheduleFlushSpy = sinon.spy(adapter, "_queueScheduleFlush");
        queueFlushSpy = sinon.spy(adapter, "_queueFlush");
        callbackSpy = sinon.spy();
      });

      afterEach(function() {
        queueScheduleFlushSpy.restore();
        queueFlushSpy.restore();
      });

      it("pushes a new item into the _queue", function() {
        adapter._enqueue(callbackSpy, ['foo']);
        assert.equal(adapter._queue.length, 1);
      });

      it("schedules a _queueFlush()", function() {
        adapter._enqueue(callbackSpy, ['foo']);
        assert.equal(queueScheduleFlushSpy.callCount, 1);
      });

      it("flushes the _queue", function(done) {
        adapter._enqueue(callbackSpy, ['foo']);
        Ember.run.later(this, function() {
          assert.equal(queueFlushSpy.callCount, 1);
          done();
        }, adapter._queueFlushDelay * 2);
      });

      it("applys the callback with the correct arguments", function(done) {
        adapter._enqueue(callbackSpy, ['foo']);
        Ember.run.later(this, function() {
          assert.equal(callbackSpy.callCount, 1);
          assert.equal(callbackSpy.getCall(0).args[0], 'foo');
          done();
        }, adapter._queueFlushDelay * 2);
      });

    }); // #_enqueue

});
