import Ember from 'ember';
import DS from 'ember-data';
import startApp from 'dummy/tests/helpers/start-app';
import { it } from 'ember-mocha';
import sinon from 'sinon';
import Firebase from 'firebase';
import createTestRef from 'dummy/tests/helpers/create-test-ref';

describe("FirebaseAdapter - Queing pushes", function() {
  var App, store, serializer, adapter, firebaseTestRef;

  before(function() {
    App = startApp();

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

  afterEach(function() {
    App.reset();
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
});
