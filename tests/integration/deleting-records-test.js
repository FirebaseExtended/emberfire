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

  describe('an embedded (hasMany) record coming from the server', function() {
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

  describe('an embedded (belongsTo) record inside another embedded record', function() {
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

  describe('relationship integrity', function() {
    var _ref, parent, child, childId, parentRef, parentId;

    describe('when a hasMany relationship exists', function () {

      beforeEach(function(done) {
        _ref = adapter._ref;
        var reference = firebaseTestRef.child('blogs/tests/adapter/deleterecord/normalized');
        adapter._ref = reference;
        Ember.run(function() {
          parent = store.createRecord('treeNode', {
            label: 'Parent'
          });
          parentId = parent.get('id');
          parentRef = reference.child('treeNodes/' + parentId);

          child = store.createRecord('treeNode', {
            label: 'Child 1'
          });
          childId = child.get('id');

          Ember.RSVP.Promise.cast(parent.get('children')).then(function(children) {
            children.pushObject(child);
            children.pushObject(store.createRecord('treeNode', {
              label: 'Child 2'
            }));
            parent.save().then(function() {
              done();
            });
          });
        });
      });

      it('removes entries from inverse side', function(done) {
        parentRef.once('value', function(snapshot1) {
          expect(snapshot1.val().children[childId]).to.exist;

          child.destroyRecord().then(function () {
            parentRef.once('value', function(snapshot2) {
              var parentData = snapshot2.val();
              expect(parentData.children[childId]).to.not.exist;
              done();
            });
          });

        });
      });

    }); // when a hasMany relationship exists

    describe('when a belongsTo relationship exists', function () {

      beforeEach(function(done) {
        _ref = adapter._ref;
        var reference = firebaseTestRef.child('blogs/tests/adapter/deleterecord/normalized');
        adapter._ref = reference;
        Ember.run(function() {
          parent = store.createRecord('treeNode', {
            label: 'Parent'
          });
          parentId = parent.get('id');
          parentRef = reference.child('treeNodes/' + parentId);

          child = store.createRecord('tree-node-config', {
            sync: true,
            updated: +new Date()
          });
          childId = child.get('id');

          parent.set('config', child);
          parent.save().then(function() {
            done();
          });
        });
      });

      it('removes entries from inverse side', function(done) {
        parentRef.once('value', function(snapshot1) {
          expect(snapshot1.val().config).to.exist;

          child.destroyRecord().then(function () {
            parentRef.once('value', function(snapshot2) {
              var parentData = snapshot2.val();
              expect(parentData.config).to.not.exist;
              done();
            });
          });

        });
      });

    }); // when a hasMany relationship exists

  }); // relationship integrity

});
