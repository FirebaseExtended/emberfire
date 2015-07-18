import Ember from 'ember';
import startApp from 'dummy/tests/helpers/start-app';
import { it } from 'ember-mocha';
import stubFirebase from 'dummy/tests/helpers/stub-firebase';
import unstubFirebase from 'dummy/tests/helpers/unstub-firebase';
import createTestRef from 'dummy/tests/helpers/create-test-ref';

describe('Integration: FirebaseAdapter - Deleting records', function() {
  var app, store, adapter, firebaseTestRef;

  beforeEach(function () {
    stubFirebase();
    app = startApp();

    firebaseTestRef = createTestRef();
    store = app.__container__.lookup('service:store');
    adapter = store.adapterFor('application');
  });

  afterEach(function() {
    unstubFirebase();
    Ember.run(app, 'destroy');
  });

  describe('when a record is created, then deleted locally', function() {
    var _ref, newPost, postId, postRef;

    beforeEach(function(done) {
      _ref = adapter._ref;
      var reference = firebaseTestRef.child('blogs/tests/adapter/deleterecord/normalized');
      adapter._ref = reference;
      Ember.run(function() {
        newPost = store.createRecord('post', {
          title: 'New Post'
        });
        postId = newPost.get('id');
        postRef = newPost.ref();
        newPost.save().then(function() {
          done();
        });
      });
    });

    it('removes the record from the server', function(done) {
      newPost.destroyRecord().then(function () {
        postRef.once('value', function(snapshot) {
          expect(snapshot.val()).to.not.exist;
          done();
        });
      });
    });

  });

  describe('when a record is retrieved through `find` and then deleted', function() {
    var _ref, post, postId, postRef;

    beforeEach(function(done) {
      _ref = adapter._ref;
      var reference = firebaseTestRef.child('blogs/normalized');
      adapter._ref = reference;
      Ember.run(function() {
        store.findRecord('post', 'post_1').then(function(p) {
          post = p;
          postId = post.get('id');
          postRef = post.ref();
          done();
        });
      });
    });

    it('removes the record from the server', function(done) {
      post.destroyRecord().then(function () {
        postRef.once('value', function(snapshot) {
          expect(snapshot.val()).to.not.exist;
          done();
        });
      });
    });

  });

  xdescribe('an embedded (hasMany) record coming from the server', function() {
    var embeddedRecord, reference;

    beforeEach(function(done) {
      reference = firebaseTestRef.child('blogs/embedded');
      adapter._ref = reference;
      Ember.run(function() {
        store.findRecord('tree-node', 'node_1').then(function(parentRecord) {
          embeddedRecord = parentRecord.get('children').objectAt(0);
          done();
        });
      });
    });

    it('removes the record from the server', function(done) {
      var nodeRef = reference.child('treeNodes/node_1/children/node_1_1');
      embeddedRecord.destroyRecord().then(function () {
        nodeRef.once('value', function(snapshot) {
          expect(snapshot.val()).to.not.exist;
          done();
        });
      });
    });

  });

  xdescribe('an embedded (belongsTo) record inside another embedded record', function() {
    var embeddedRecord, reference;

    beforeEach(function(done) {
      reference = firebaseTestRef.child('blogs/embedded');
      adapter._ref = reference;
      Ember.run(function() {
        store.findRecord('tree-node', 'node_4').then(function(post) {
          embeddedRecord = post.get('children').objectAt(0).get('config');
          done();
        });
      });
    });

    it('removes the record from the server', function(done) {
      var embeddedRef = reference.child('treeNodes/node_4/children/node_4_1/config');
      embeddedRecord.destroyRecord().then(function () {
        embeddedRef.once('value', function(snapshot) {
          expect(snapshot.val()).to.not.exist;
          done();
        });
      });
    });

  });

  describe('when a belongsTo relationship exists', function() {
    var _ref, newPost, newUser, postId, userRef, userId;

    beforeEach(function(done) {
      _ref = adapter._ref;
      var reference = firebaseTestRef.child('blogs/tests/adapter/deleterecord/normalized');
      adapter._ref = reference;
      Ember.run(function() {
        newUser = store.createRecord('user', {
          firstName: 'Tom'
        });
        newPost = store.createRecord('post', {
          title: 'New Post'
        });
        postId = newPost.get('id');
        userId = newUser.get('id');
        userRef = reference.child('users/' + userId);
        Ember.RSVP.Promise.cast(newUser.get('posts')).then(function(posts) {
          posts.pushObject(newPost);
          newUser.save().then(function() {
            done();
          });
        });
      });
    });

    it('removes entries from inverse (hasMany) side', function(done) {
      newPost.destroyRecord().then(function () {
        userRef.once('value', function(snapshot) {
          var userData = snapshot.val();
          expect(userData.posts).to.not.exist;
          done();
        });
      });
    });

  });

});
