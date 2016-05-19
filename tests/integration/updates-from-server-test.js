import Ember from 'ember';
import startApp from 'dummy/tests/helpers/start-app';
import destroyApp from 'dummy/tests/helpers/destroy-app';
import { it } from 'ember-mocha';
import stubFirebase from 'dummy/tests/helpers/stub-firebase';
import unstubFirebase from 'dummy/tests/helpers/unstub-firebase';
import createTestRef from 'dummy/tests/helpers/create-test-ref';

describe('Integration: FirebaseAdapter - Updates from server', function() {
  var app, store, adapter, firebaseTestRef;

  var setupAdapter = function() {
    app = startApp();

    firebaseTestRef = createTestRef();
    store = app.__container__.lookup('service:store');
    adapter = store.adapterFor('application');
    adapter._ref = createTestRef('blogs/normalized');
    adapter._queueFlushDelay = false;
  };

  beforeEach(function () {
    stubFirebase();
    setupAdapter();
  });

  afterEach(function() {
    unstubFirebase();
    destroyApp(app);
  });

  describe('A locally created (and saved) record', function() {
    var newPost, postId;

    beforeEach(function(done) {
      var reference = firebaseTestRef.child('blogs/tests/adapter/updaterecord/normalized');
      adapter._ref = reference;
      Ember.run(function() {
        newPost = store.createRecord('post', {
          title: 'New Post'
        });
        postId = newPost.get('id');
        newPost.save().then(function() {
          reference.child('posts').child(postId).child('title').set('Updated', function() {
            done();
          });
        });
      });
    });

    it('receives server updates correctly', function() {
      expect(newPost.get('title')).to.equal('Updated', 'property should change');
    });

    it('has the correct .ref()', function() {
      var refPath = newPost.ref().path.toString();
      var expectedPath = `/blogs/tests/adapter/updaterecord/normalized/posts/${postId}`;
      expect(refPath).to.equal(expectedPath);
    });

  });

  describe('A record coming from find', function() {
    var reference, newPost;

    beforeEach(function(done) {
      reference = adapter._ref;
      Ember.run(function() {
        store.findRecord('post', 'post_1').then(function(post) {
          newPost = post;
          done();
        });
      });
    });

    it('receives server updates correctly', function(done) {
      reference.child('posts/post_1/body').set('Updated', function() {
        expect(newPost.get('body')).to.equal('Updated', 'property should change');
        done();
      });
    });

    it('receives server property deletions correctly', function(done) {
      reference.child('posts/post_1/body').remove(function() {
        expect(newPost.get('body')).to.equal(null, 'property should be deleted');
        done();
      });
    });

    it('has the correct .ref()', function() {
      var refPath = newPost.ref().path.toString();
      var expectedPath = `/blogs/normalized/posts/post_1`;
      expect(refPath).to.equal(expectedPath);
    });
  });

  describe('An embedded (hasMany) record coming from the server', function() {
    var embeddedRecord, reference;

    beforeEach(function(done) {
      reference = firebaseTestRef.child('blogs/embedded');
      adapter._ref = reference;
      Ember.run(function() {
        store.findRecord('tree-node', 'node_1').then(function(post) {
          embeddedRecord = post.get('children').objectAt(0);
          done();
        });
      });
    });

    it('receives server updates', function(done) {
      reference.child('treeNodes/node_1/children/node_1_1/label').set('Updated', function() {
        expect(embeddedRecord.get('label')).to.equal('Updated', 'property should change');
        done();
      });
    });

    it('has transforms applied correctly', function() {
      expect(embeddedRecord.get('created')).to.be.a('number');
    });

    it('has the correct .ref()', function() {
      var refPath = embeddedRecord.ref().path.toString();
      var expectedPath = `/blogs/embedded/treeNodes/node_1/children/node_1_1`;
      expect(refPath).to.equal(expectedPath);
    });

  });

  describe('An embedded (belongsTo) record coming from the server', function() {
    var embeddedRecord, reference;

    beforeEach(function(done) {
      reference = firebaseTestRef.child('blogs/embedded');
      adapter._ref = reference;
      Ember.run(function() {
        store.findRecord('tree-node', 'node_3').then(function(post) {
          embeddedRecord = post.get('config');
          done();
        });
      });
    });

    it('receives server updates', function(done) {
      reference.child('treeNodes/node_3/config/sync').set(false, function() {
        expect(embeddedRecord.get('sync')).to.equal(false, 'property should change');
        done();
      });
    });

    it('has transforms applied correctly', function() {
      expect(embeddedRecord.get('updated')).to.be.a('number');
    });

    it('has the correct .ref()', function() {
      var refPath = embeddedRecord.ref().path.toString();
      var expectedPath = `/blogs/embedded/treeNodes/node_3/config`;
      expect(refPath).to.equal(expectedPath);
    });

  });

  describe('An embedded (belongsTo) record inside another embedded record', function() {
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

    it('loads correctly', function() {
      expect(embeddedRecord.get('sync')).to.equal(true);
    });

    it('receives server updates', function(done) {
      reference.child('treeNodes/node_4/children/node_4_1/config/sync').set(false, function() {
        expect(embeddedRecord.get('sync')).to.equal(false, 'property should change');
        done();
      });
    });

    it('has the correct .ref()', function() {
      var refPath = embeddedRecord.ref().path.toString();
      var expectedPath = `/blogs/embedded/treeNodes/node_4/children/node_4_1/config`;
      expect(refPath).to.equal(expectedPath);
    });

  });

  describe('Setting a belongsTo to null, wipes it from the server as well issue #103', function() {
    var commentData;

    beforeEach(function(done) {
      var reference = adapter._ref;
      Ember.run(function() {
        store.findRecord('comment', 'comment_1').then(function(comment) {
          comment.set('user', null);
          comment.save().then(function(){
            reference.child('comments/comment_1').once('value', function(data) {
              commentData = data.val();
              done();
            });
          });
        });
      });
    });

    it('Removed the user from the server', function() {
      expect(commentData.user).to.not.exist;
    });
  });

  describe('Deleting a record serverside, deletes it client side as well', function() {
    var currentComment;

    beforeEach(function(done) {
      var reference = adapter._ref;
      Ember.run(function() {
        store.findRecord('comment', 'comment_1').then(function(comment) {
          currentComment = comment;
          reference.child('comments/comment_1').set(null, function() {
            done();
          });
        });
      });
    });

    it('Comment was deleted client side as well', function() {
      expect(currentComment.get('isDeleted')).to.be.true;
    });
  });

  describe('hasMany relationships', function() {
    var currentPost, reference;

    beforeEach(function(done) {
      reference = adapter._ref;
      Ember.run(function() {
        store.findRecord('post', 'post_1').then(function(post) {
          currentPost = post;
          done();
        });
      });
    });


    it('removes the correct client side association when removed on server', function(done) {
      expect(currentPost.get('comments.length') === 2, 'should have 2 related comments');
      Ember.run(function () {
        reference.child('posts/post_1/comments/comment_1').remove(function() {
          expect(currentPost.get('comments.firstObject.id')).to.equal('comment_2', 'only comment_2 should remain');
          done();
        });
      });
    });

    it('removes all client side associations when entire property is removed', function(done) {
      expect(currentPost.get('comments.length') === 2, 'should have 2 related comments');
      Ember.run(function () {
        reference.child('posts/post_1/comments').remove(function() {
          expect(currentPost.get('comments.length')).to.equal(0, 'all related comments should be removed');
          done();
        });
      });
    });

  });

  describe('belongsTo relationships', function() {
    var currentComment, reference;

    beforeEach(function(done) {
      reference = adapter._ref;
      Ember.run(function() {
        store.findRecord('comment', 'comment_1').then(function(comment) {
          currentComment = comment;
          done();
        });
      });
    });


    it('removes the client side association when removed on server', function(done) {
      expect(currentComment.get('user.id')).to.exist;
      Ember.run(function () {
        reference.child('comments/comment_1/user').remove(function() {
          expect(currentComment.get('user.id')).to.not.exist;
          done();
        });
      });
    });

  });

  describe('Deleting a record clientside, deletes it on the server side as well', function() {
    var reference;

    beforeEach(function(done) {
      reference = adapter._ref;
      Ember.run(function() {
        store.findRecord('comment', 'comment_2').then(function(comment) {
          comment.destroyRecord().then(function() {
            done();
          });
        });
      });
    });

    it('Comment was deleted server side as well', function(done) {
      reference.child('comments/comment_2').once('value', function(data) {
        expect(data.val()).to.not.exist;
        done();
      });
    });
  });

  describe('Editing a found record clientside, edits it on the server side as well', function() {
    var reference;

    beforeEach(function(done) {
      reference = adapter._ref;
      Ember.run(function() {
        store.findRecord('comment', 'comment_3').then(function(comment) {
          comment.set('body', 'Updated');
          comment.save().then(function() {
            done();
          });
        });
      });
    });

    it('Comment was edited server side as well', function(done) {
      reference.child('comments/comment_3/body').once('value', function(data) {
        expect(data.val()).to.equal('Updated');
        done();
      });
    });
  });
});
