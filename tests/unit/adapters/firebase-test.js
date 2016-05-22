/* jshint expr:true */
import Ember from 'ember';
import {
  describeModule,
  it
} from 'ember-mocha';

import firebase from 'firebase';

import sinon from 'sinon';
import stubFirebase from 'dummy/tests/helpers/stub-firebase';
import unstubFirebase from 'dummy/tests/helpers/unstub-firebase';
import createOfflineRef from 'dummy/tests/helpers/create-offline-ref';

describeModule('emberfire@adapter:firebase', 'FirebaseAdapter', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  },
  function() {

    beforeEach(function() {
      stubFirebase();
      const ref = createOfflineRef();
      this.registry.register('service:firebase', ref, {instantiate: false, singleton: true});
    });

    afterEach(function() {
      unstubFirebase();
    });

    describe('#init', function () {


      it('throws an error when the firebase property is not supplied', function() {
        assert.throws(function() {
          this.subject();
        });
      });

    }); // #init

    describe('#applyQueryToRef', function () {
      var adapter, ref, stub;

      beforeEach(function () {
        adapter = this.subject();
        ref = adapter._ref;
      });

      afterEach(function() {
        if (stub.restore) {
          stub.restore();
        }
      });

      it('defaults to orderByKey when orderBy is not supplied', function () {
        stub = sinon.stub(ref, 'orderByKey');

        adapter.applyQueryToRef(ref, {});
        assert(stub.calledOnce, 'orderByKey should be called');
      });

      it('defaults to orderByKey when orderBy is an empty string', function () {
        stub = sinon.stub(ref, 'orderByKey');

        adapter.applyQueryToRef(ref, { orderBy: '' });
        assert(stub.calledOnce, 'orderByKey should be called');
      });

      ['key', 'value', 'priority'].forEach(function (k) {
        var upperK = Ember.String.capitalize(k);

        it(`orderBy: "_${k}" calls orderBy${upperK}`, function () {
          stub = sinon.stub(ref, 'orderBy' + upperK);

          adapter.applyQueryToRef(ref, { orderBy: '_' + k });
          assert(stub.calledOnce, `orderBy${upperK} should be called`);
        });

      });

      it('orderBy: `x` calls orderByChild(x)', function () {
        stub = sinon.stub(ref, 'orderByChild');

        adapter.applyQueryToRef(ref, { orderBy: 'x' });
        assert(stub.calledWith('x'), 'orderByChild should be called with `x`');
      });

      ['limitToFirst', 'limitToLast', 'startAt', 'endAt', 'equalTo'].forEach(function (method) {

        var queryMethodStub;

        beforeEach(function() {
          queryMethodStub = sinon.stub(firebase.database.Query.prototype, method);
        });

        afterEach(function() {
          queryMethodStub.restore();
        });

        it(`calls ${method} and passes through value when specified`, function () {
          var query = {};

          query[method] = 'value';

          adapter.applyQueryToRef(ref, query);
          assert(queryMethodStub.calledOnce);
          assert(queryMethodStub.calledWith('value'));
        });

        it(`calls ${method} and passes through value when empty string`, function () {
          var query = {};

          query[method] = '';

          adapter.applyQueryToRef(ref, query);
          assert(queryMethodStub.calledOnce);
          assert(queryMethodStub.calledWith(''));
        });

        it(`calls ${method} and passes through value when 'false'`, function () {
          var query = {};

          query[method] = false;

          adapter.applyQueryToRef(ref, query);
          assert(queryMethodStub.calledOnce);
          assert(queryMethodStub.calledWith(false));
        });

        it(`does not call ${method} when the value is null`, function () {
          var query = {};

          query[method] = null;

          adapter.applyQueryToRef(ref, query);
          assert(queryMethodStub.called === false, `${method} should not be called`);
        });

      }); // forEach

    }); // #applyQueryToRef

    describe("#_queueScheduleFlush", function() {

      var adapter, spy;

      beforeEach(function() {
        adapter = this.subject({
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
