/* jshint expr:true */
import Ember from 'ember';
import DS from 'ember-data';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';
import { expect } from 'chai';
import firebase from 'firebase';

import sinon from 'sinon';
import stubFirebase from 'dummy/tests/helpers/stub-firebase';
import unstubFirebase from 'dummy/tests/helpers/unstub-firebase';
import createOfflineRef from 'dummy/tests/helpers/create-offline-ref';
import destroyFirebaseApps from 'dummy/tests/helpers/destroy-firebase-apps';

const { run } = Ember;

describe('FirebaseAdapter', function() {
  setupTest('emberfire@adapter:firebase', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });

  beforeEach(function() {
    stubFirebase();
    const ref = createOfflineRef();
    this.registry.register('service:firebase', ref, {instantiate: false, singleton: true});
  });

  afterEach(function() {
    unstubFirebase();
    destroyFirebaseApps();
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

      if (method === 'limitToFirst' || method === 'limitToLast') {
        it(`calls ${method} and passes through value when an integer`, function () {
          var query = {};

          query[method] = 10;

          adapter.applyQueryToRef(ref, query);
          expect(queryMethodStub.calledOnce).to.be.ok;
          expect(queryMethodStub.calledWith(10)).to.be.ok;
        });

        it(`does not call ${method} when the value is null`, function () {
          var query = {};

          query[method] = null;

          adapter.applyQueryToRef(ref, query);
          expect(queryMethodStub.called === false, `${method} should not be called`).to.be.ok;
        });

        it(`does not call ${method} when value is a string`, function () {
          var query = {};

          query[method] = 'value';

          adapter.applyQueryToRef(ref, query);
          expect(queryMethodStub.called === false, `${method} should not be called`).to.be.ok;
        });

        it(`does not call ${method} when value is 'false'`, function () {
          var query = {};

          query[method] = false;

          adapter.applyQueryToRef(ref, query);
          expect(queryMethodStub.called === false, `${method} should not be called`).to.be.ok;
        });

      } else {
        it(`calls ${method} when the value is null`, function () {
          var query = {};

          query[method] = null;

          adapter.applyQueryToRef(ref, query);
          expect(queryMethodStub.calledOnce).to.be.ok;
          expect(queryMethodStub.calledWith(null)).to.be.ok;
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

      }
    }); // forEach

  }); // #applyQueryToRef

  describe("#_flushLater", function() {

    var adapter, flushQueueSpy;

    beforeEach(function() {
      adapter = this.subject({
        _queueFlushDelay: 1
      });
      flushQueueSpy = sinon.spy(adapter, "_flushQueue");
    });

    afterEach(function() {
      flushQueueSpy.restore();
    });

    it("schedules a #_flushQueue", function(done) {
      adapter._flushLater();
      run.later(this, function() {
        expect(flushQueueSpy.callCount).to.equal(1);
        done();
      }, adapter._queueFlushDelay * 2);
    });

  }); // #_flushLater

  describe("#_pushLater", function() {
    var adapter, flushLaterSpy, flushQueueSpy;
    let store;
    let storePushSpy;

    beforeEach(function() {
      adapter = this.subject({
        _queueFlushDelay: 1
      });

      const User = DS.Model.extend({
        name: DS.attr('string'),
      });

      this.registry.register('model:user', User, {instantiate: false, singleton: false});
      this.registry.register('adapter:user', adapter, {instantiate: false, singleton: false});

      flushLaterSpy = sinon.spy(adapter, "_flushLater");
      flushQueueSpy = sinon.spy(adapter, "_flushQueue");
      store = adapter.get('store');
      storePushSpy = sinon.spy(store, 'push');
    });

    afterEach(function() {
      flushLaterSpy.restore();
      flushQueueSpy.restore();
      storePushSpy.restore();
    });

    it("pushes a new item into the _queue", function() {
      adapter._pushLater('user', '12345', {id: '12345', name: 'Tim'});
      expect(adapter._queue.length).to.equal(1);
    });

    it("schedules a _flushQueue()", function() {
      adapter._pushLater('user', '12345', {id: '12345', name: 'Tim'});
      expect(flushLaterSpy.callCount).to.equal(1);
    });

    it("flushes the _queue", function(done) {
      adapter._pushLater('user', '12345', {id: '12345', name: 'Tim'});
      run.later(this, function() {
        expect(flushQueueSpy.callCount).to.equal(1);
        done();
      }, adapter._queueFlushDelay * 2);
    });

    it("only flushes once for multiple pushes", function(done) {
      adapter._queueFlushDelay = 20;
      adapter._pushLater('user', '12345', {id: '12345', name: 'Tim'});
      adapter._pushLater('user', '12555', {id: '12555', name: 'Tom'});
      adapter._pushLater('user', '12556', {id: '12556', name: 'Tam'});
      adapter._pushLater('user', '12557', {id: '12557', name: 'Tum'});
      run.later(this, function() {
        expect(flushQueueSpy.callCount).to.equal(1);
        done();
      }, adapter._queueFlushDelay * 2);
    });

    it("pushes immediately if adapter._queueFlushDelay == 0", function() {
      run(function() {
        adapter._queueFlushDelay = 0;
        adapter._pushLater('user', '12345', {id: '12345', name: 'Tim'});

        expect(storePushSpy.callCount).to.equal(1);
        expect(storePushSpy.getCall(0).args[0].data).to.deep.equal({
          id: '12345',
          type: 'user',
          attributes: {name: 'Tim'},
          relationships: {},
        });
      });
    });

    it("calls store.push later with normalized data", function(done) {
      adapter._pushLater('user', '12345', {id: '12345', name: 'Tim'});

      run.later(this, function() {
        expect(storePushSpy.getCall(0).args[0].data)
            .to.deep.equal({
              id: '12345',
              type: 'user',
              attributes: {name: 'Tim'},
              relationships: {},
            });
        done();
      }, adapter._queueFlushDelay * 2);
    });

    it("only pushes once, per record, per flush", function(done) {
      adapter._pushLater('user', '12345', {id: '12345', name: 'Tim'});
      adapter._pushLater('user', '12555', {id: '12555', name: 'Tom'});
      adapter._pushLater('user', '12345', {id: '12345', name: 'Tim'});

      run.later(this, function() {
        expect(storePushSpy.callCount).to.equal(2);
        expect(storePushSpy.getCall(0).args[0].data.attributes)
            .to.deep.equal({name: 'Tom'});
        expect(storePushSpy.getCall(1).args[0].data.attributes)
            .to.deep.equal({name: 'Tim'});
        done();
      }, adapter._queueFlushDelay * 2);
    });

  }); // #_pushLater
});
