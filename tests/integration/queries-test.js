import Ember from 'ember';
import startApp from 'dummy/tests/helpers/start-app';
import { it } from 'ember-mocha';
import stubFirebase from 'dummy/tests/helpers/stub-firebase';
import unstubFirebase from 'dummy/tests/helpers/unstub-firebase';
import createTestRef from 'dummy/tests/helpers/create-test-ref';

describe('Integration: FirebaseAdapter - Queries', function() {
  var app, store, adapter, queryArray, ref;

  beforeEach(function(done) {
    stubFirebase();

    app = startApp();

    ref = createTestRef('blogs/queries');

    store = app.__container__.lookup('service:store');
    adapter = store.adapterFor('application');
    adapter._ref = ref;
    adapter._queueFlushDelay = false;

    var query = { limitToLast: 3 };

    queryArray = store.recordArrayManager.createAdapterPopulatedRecordArray(store.modelFor('post'), query);

    Ember.run(function () {
      adapter.query(store, store.modelFor('post'), query, queryArray)
        .then((records) => {
          queryArray.load(records);
          done();
        });
    });
  });

  afterEach(function() {
    unstubFirebase();
    Ember.run(app, 'destroy');
  });

  it('creates the correct Firebase reference', function() {
    assert(ref.toString().match(/blogs\/queries$/g));
  });

  it('resolves with the correct initial payload', function() {
    assert(Ember.isArray(queryArray));
    assert.deepEqual(queryArray.get('content').mapBy('id'), ['post_1', 'post_2', 'post_3'], 'array should contain post_1, 2, 3');
  });

  describe('when an item is added to the resultset', function () {
    it('populates the item in the array', function(done) {
      Ember.run(() => {
        ref.child('posts/post_4').set({ title: 'Post 4', body: 'Body', published: 1395162147646, user: 'tstirrat' }, function () {
            assert(queryArray.get('content').isAny('id', 'post_4'), 'post_4 should exist in the array');
            done();
        });
      });
    });
  });

  describe('when an item is removed from the resultset', function () {
    it('removes the item in the array', function(done) {
      Ember.run(() => {
        ref.child('posts/post_3').remove(function () {
            assert(!queryArray.get('content').isAny('id', 'post_3'), 'post_3 should not exist in the array');
            done();
        });
      });
    });
  });

  describe('when a resultset changes size', function () {
    it('alters the array size', function(done) {
      Ember.run(() => {
        ref.child('posts/post_3').remove(function () {
            assert.deepEqual(queryArray.get('content').mapBy('id'), ['post_1', 'post_2']);
            done();
        });
      });
    });
  });

});
