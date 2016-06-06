import Ember from 'ember';
import startApp from 'dummy/tests/helpers/start-app';
import destroyApp from 'dummy/tests/helpers/destroy-app';
import { it } from 'ember-mocha';
import { expect } from 'chai';
import stubFirebase from 'dummy/tests/helpers/stub-firebase';
import unstubFirebase from 'dummy/tests/helpers/unstub-firebase';
import replaceAppRef from 'dummy/tests/helpers/replace-app-ref';
import createTestRef from 'dummy/tests/helpers/create-test-ref';

const { run } = Ember;

describe('Integration: FirebaseAdapter - Queries', function() {
  var app, store, adapter, queryArray, ref;

  beforeEach(function(done) {
    stubFirebase();

    app = startApp();

    ref = createTestRef('blogs/queries');

    replaceAppRef(app, ref);

    store = app.__container__.lookup('service:store');
    adapter = store.adapterFor('application');

    var query = { limitToLast: 3 };

    queryArray = store.recordArrayManager.createAdapterPopulatedRecordArray(store.modelFor('post'), query);

    run(function () {
      adapter.query(store, store.modelFor('post'), query, queryArray)
        .then(() => {
          done();
        });
    });
  });

  afterEach(function() {
    unstubFirebase();
    destroyApp(app);
  });

  it('creates the correct Firebase reference', function() {
    expect(ref.toString()).to.match(/blogs\/queries$/g);
  });

  it('resolves with the correct initial payload', function() {
    expect(queryArray.get('length')).to.equal(3, 'array should have length of 3');
    expect(queryArray.get('content').mapBy('id')).to.eql(['post_1', 'post_2', 'post_3'], 'array should contain post_1, 2, 3');
  });

  describe('when an item is added to the resultset', function () {
    it('populates the item in the array', function(done) {
      run(() => {
        ref.child('posts/post_4').set({ title: 'Post 4', body: 'Body', published: 1395162147646, user: 'tstirrat' }, function () {
            expect(queryArray.get('content').isAny('id', 'post_4'), 'post_4 should exist in the array').to.be.ok;
            done();
        });
      });
    });
  });

  describe('when an item is removed from the resultset', function () {
    it('removes the item in the array', function(done) {
      run(() => {
        ref.child('posts/post_3').remove(function () {
            expect(!queryArray.get('content').isAny('id', 'post_3'), 'post_3 should not exist in the array').to.be.ok;
            done();
        });
      });
    });
  });

  describe('when a resultset changes size', function () {
    it('alters the array size', function(done) {
      run(() => {
        ref.child('posts/post_3').remove(function () {
            expect(queryArray.get('content').mapBy('id')).to.eql(['post_1', 'post_2']);
            done();
        });
      });
    });
  });

});
