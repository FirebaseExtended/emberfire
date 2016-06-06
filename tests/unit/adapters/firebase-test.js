/* jshint expr:true */
import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';
import { expect } from 'chai';
import firebase from 'firebase';

import sinon from 'sinon';
import stubFirebase from 'dummy/tests/helpers/stub-firebase';
import unstubFirebase from 'dummy/tests/helpers/unstub-firebase';
import createOfflineRef from 'dummy/tests/helpers/create-offline-ref';

const { run } = Ember;

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
        expect(stub.calledOnce, 'orderByKey should be called').to.be.ok;
      });

      it('defaults to orderByKey when orderBy is an empty string', function () {
        stub = sinon.stub(ref, 'orderByKey');

        adapter.applyQueryToRef(ref, { orderBy: '' });
        expect(stub.calledOnce, 'orderByKey should be called').to.be.ok;
      });

      ['key', 'value', 'priority'].forEach(function (k) {
        var upperK = Ember.String.capitalize(k);

        it(`orderBy: "_${k}" calls orderBy${upperK}`, function () {
          stub = sinon.stub(ref, 'orderBy' + upperK);

          adapter.applyQueryToRef(ref, { orderBy: '_' + k });
          expect(stub.calledOnce, `orderBy${upperK} should be called`).to.be.ok;
        });

      });

      it('orderBy: `x` calls orderByChild(x)', function () {
        stub = sinon.stub(ref, 'orderByChild');

        adapter.applyQueryToRef(ref, { orderBy: 'x' });
        expect(stub.calledWith('x'), 'orderByChild should be called with `x`').to.be.ok;
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
          expect(queryMethodStub.calledOnce).to.be.ok;
          expect(queryMethodStub.calledWith('value')).to.be.ok;
        });

        it(`calls ${method} and passes through value when empty string`, function () {
          var query = {};

          query[method] = '';

          adapter.applyQueryToRef(ref, query);
          expect(queryMethodStub.calledOnce).to.be.ok;
          expect(queryMethodStub.calledWith('')).to.be.ok;
        });

        it(`calls ${method} and passes through value when 'false'`, function () {
          var query = {};

          query[method] = false;

          adapter.applyQueryToRef(ref, query);
          expect(queryMethodStub.calledOnce).to.be.ok;
          expect(queryMethodStub.calledWith(false)).to.be.ok;
        });

        it(`does not call ${method} when the value is null`, function () {
          var query = {};

          query[method] = null;

          adapter.applyQueryToRef(ref, query);
          expect(queryMethodStub.called === false, `${method} should not be called`).to.be.ok;
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
        run.later(this, function() {
          expect(spy.callCount).to.equal(1);
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
        expect(adapter._queue.length).to.equal(1);
      });

      it("schedules a _queueFlush()", function() {
        adapter._enqueue(callbackSpy, ['foo']);
        expect(queueScheduleFlushSpy.callCount).to.equal(1);
      });

      it("flushes the _queue", function(done) {
        adapter._enqueue(callbackSpy, ['foo']);
        run.later(this, function() {
          expect(queueFlushSpy.callCount).to.equal(1);
          done();
        }, adapter._queueFlushDelay * 2);
      });

      it("applys the callback with the correct arguments", function(done) {
        adapter._enqueue(callbackSpy, ['foo']);
        run.later(this, function() {
          expect(callbackSpy.callCount).to.equal(1);
          expect(callbackSpy.getCall(0).args[0]).to.equal('foo');
          done();
        }, adapter._queueFlushDelay * 2);
      });

    }); // #_enqueue

});
