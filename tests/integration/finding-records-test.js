import Ember from 'ember';
import startApp from 'dummy/tests/helpers/start-app';
import destroyApp from 'dummy/tests/helpers/destroy-app';
import { it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import stubFirebase from 'dummy/tests/helpers/stub-firebase';
import unstubFirebase from 'dummy/tests/helpers/unstub-firebase';
import createTestRef from 'dummy/tests/helpers/create-test-ref';
import replaceAppRef from 'dummy/tests/helpers/replace-app-ref';

const { run } = Ember;

describe('Integration: FirebaseAdapter - Finding Records', function() {
  var app, store, adapter;

  beforeEach(function() {
    stubFirebase();

    app = startApp();
    replaceAppRef(app, createTestRef('blogs/normalized'));

    store = app.__container__.lookup('service:store');
    adapter = store.adapterFor('application');
  });

  afterEach(function() {
    unstubFirebase();
    destroyApp(app);
  });

  describe('#init()', function() {
    it('has a Firebase ref', function() {
      expect(adapter._ref !== undefined, 'ref is defined').to.be.ok;
    });
  });

  describe('#_getCollectionRef()', function() {
    it('returns the correct Firebase ref for a type', function() {
      var ref = adapter._getCollectionRef(store.modelFor('post'));
      expect(ref.toString()).to.match(/blogs\/normalized\/posts$/g);
    });

    it('returns the correct Firebase ref for a type and id', function() {
      var ref = adapter._getCollectionRef(store.modelFor('post'), 'post_1');
      expect(ref.toString()).to.match(/blogs\/normalized\/posts\/post_1$/g);
    });

  });


  describe('#find()', function() {

    var getRefSpy, findPromise, findRef;

    beforeEach(function(done) {
      getRefSpy = sinon.spy(adapter, '_getCollectionRef');
      run(() => {
        findPromise =  adapter.findRecord(store, store.modelFor('post'), 'post_1');

        findPromise.then(() => {
          findRef = getRefSpy.getCall(0).returnValue;
          done();
        });
      });
    });

    afterEach(function() {
      getRefSpy.restore();
    });

    it('creates a single Firebase reference', function() {
      expect(getRefSpy.calledOnce).to.be.ok;
    });

    it('creates the correct Firebase reference', function() {
      expect(findRef.toString()).to.match(/blogs\/normalized\/posts\/post_1$/g);
    });

    it('returns a promise', function() {
      expect(findPromise.then).to.be.a('function');
    });

    it('resolves with the correct payload', function(done) {
      run(() => {
        findPromise.then(function(payload) {
          expect(payload.id).to.be.equal('post_1');
          done();
        });
      });
    });

    it('throws an error for records that don\'t exist', function(done) {
      run(() => {
         adapter.findRecord(store, store.modelFor('post'), 'foobar').then(function() {}, function(error) {
          expect(error).to.be.an.instanceof(Error);
          done();
        });
      });
    });
  });

  describe('#findAll()', function() {

    var getRefSpy, findAllAddEventListenersSpy, handleChildValueSpy;
    var findAllPromise, findAllRef;

    beforeEach(function(done) {
      getRefSpy = sinon.spy(adapter, '_getCollectionRef');
      findAllAddEventListenersSpy = sinon.spy(adapter, '_findAllAddEventListeners');
      handleChildValueSpy = sinon.spy(adapter, '_handleChildValue');

      run(() => {
        findAllPromise = adapter.findAll(store, store.modelFor('post'));

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

    it('creates the correct Firebase reference', function() {
      expect(findAllRef.toString()).to.match(/blogs\/normalized\/posts$/g);
    });

    it('returns a promise', function() {
      expect(findAllPromise.then).to.be.a('function');
    });

    it('resolves with the correct payload', function(done) {
      run(() => {
        findAllPromise.then(function(payload) {
          expect(payload).to.be.an('array');
          expect(payload).to.have.lengthOf(3);
          done();
        });
      });
    });

    it('only adds event listeners once per type', function(done) {
      adapter.findAll(store, store.modelFor('post')).then(function() {
        expect(findAllAddEventListenersSpy.callCount).to.equal(1);
        done();
      });
    });

    it('adds new child values to the store', function(done) {
      run(() => {
        findAllRef.child('post_3').set({
          published: 1395162147646,
          body: 'This is the third FireBlog post!',
          title: 'Post 3'
        }, () => {
          run.later(() => {
            expect(store.hasRecordForId('post', 'post_3'), 'has the new child').to.be.ok;
            done();
          }, 50);
        });
      });
    });

    it('handles empty collections', function(done) {
      run(() => {
        adapter.findAll(store, store.modelFor('tree-node')).then(function(posts) {
          expect(posts).to.be.an('array');
          expect(posts).to.have.lengthOf(0);
          done();
        });
      });
    });
  });
});
