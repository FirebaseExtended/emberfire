import Ember from 'ember';
import DS from 'ember-data';
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
          assert.equal(snapshot.val(), null);
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
          assert.equal(snapshot.val(), null);
          done();
        });
      });
    });

  });

  describe('an embedded (hasMany) record coming from the server', function() {
    var comment, reference;

    beforeEach(function(done) {
      // needs a better way that uses the container
      app.Post = DS.Model.extend({
        title: DS.attr('string'),
        body: DS.attr('string'),
        published: DS.attr('number'),
        publishedDate: Ember.computed('published', function() {
          return this.get('published');
        }),
        user: DS.belongsTo('user', { async: true }),
        comments: DS.hasMany('comment', { async: true }),
        embeddedComments: DS.hasMany('comment', { async: false, embedded: true })
      });

      reference = firebaseTestRef.child('blogs/double_denormalized');
      adapter._ref = reference;
      Ember.run(function() {
        store.findRecord('post', 'post_1').then(function(post) {
          comment = post.get('embeddedComments').objectAt(0);
          done();
        });
      });
    });

    afterEach(() => {
      delete app.Post;
    });

    it('removes the record from the server', function(done) {
      var commentRef = reference.child('posts/post_1/embeddedComments/comment_1');
      comment.destroyRecord().then(function () {
        commentRef.once('value', function(snapshot) {
          assert.equal(snapshot.val(), null);
          done();
        });
      });
    });

  });

  describe('an embedded (belongsTo) record inside another embedded record', function() {
    var user, reference;

    beforeEach(function(done) {
      app.Post = DS.Model.extend({
        title: DS.attr('string'),
        body: DS.attr('string'),
        published: DS.attr('number'),
        publishedDate: Ember.computed('published', function() {
          return this.get('published');
        }),
        user: DS.belongsTo('user', { async: true }),
        comments: DS.hasMany('comment', { async: true }),
        embeddedComments: DS.hasMany('comment', { async: false, embedded: true })
      });

      app.Comment = DS.Model.extend({
        body: DS.attr('string'),
        published: DS.attr('number'),
        publishedDate: Ember.computed('published', function() {
          return this.get('published');
        }),
        user: DS.belongsTo('user', { async: true }),
        embeddedUser: DS.belongsTo('user', { async: false, embedded: true, inverse:null })
      });

      reference = firebaseTestRef.child('blogs/double_denormalized');
      adapter._ref = reference;
      Ember.run(function() {
        store.findRecord('post', 'post_1').then(function(post) {
          user = post.get('embeddedComments').objectAt(0).get('embeddedUser');
          done();
        });
      });
    });

    afterEach(() => {
      delete app.Post;
      delete app.Comment;
    });

    it('removes the record from the server', function(done) {
      var userRef = reference.child('posts/post_1/embeddedComments/comment_1/embeddedUser');
      user.destroyRecord().then(function () {
        userRef.once('value', function(snapshot) {
          assert.equal(snapshot.val(), null);
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
          assert(typeof userData.posts === 'undefined');
          done();
        });
      });
    });

  });

});
