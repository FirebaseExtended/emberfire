import Ember from 'ember';
import DS from 'ember-data';
import startApp from 'dummy/tests/helpers/start-app';
import { it } from 'ember-mocha';
import stubFirebase from 'dummy/tests/helpers/stub-firebase';
import unstubFirebase from 'dummy/tests/helpers/unstub-firebase';
import createTestRef from 'dummy/tests/helpers/create-test-ref';

describe('Integration: FirebaseSerializer - Serializing records', function() {
  var app, store, adapter, firebaseTestRef;

  var setupAdapter = function() {
    app = startApp();
    store = app.__container__.lookup('service:store');
    adapter = store.adapterFor('application');
    adapter._ref = createTestRef('blogs/normalized');
    adapter._queueFlushDelay = false;
    firebaseTestRef = createTestRef('blogs/tests/adapter/updaterecord');
  };

  beforeEach(function () {
    stubFirebase();
    setupAdapter();
  });

  afterEach(function() {
    Ember.run(app, 'destroy');
    unstubFirebase();
  });

  describe('#serialize()', function() {

    describe('hasMany relationships', function() {

      var newUser, newComment, serializer;

      beforeEach(function(done) {
        app.User = DS.Model.extend({
          created: DS.attr('number'),
          username: Ember.computed(function() {
            return this.get('id');
          }),
          firstName: DS.attr('string'),
          avatar: Ember.computed(function() {
            return 'https://www.gravatar.com/avatar/' + md5(this.get('id')) + '.jpg?d=retro&size=80';
          }),
          posts: DS.hasMany('post', { async: true }),
          comments: DS.hasMany('comment', { async: true, inverse: 'user' })
        });

        adapter._ref = firebaseTestRef.child('normalized');
        serializer = store.serializerFor('user');

        Ember.run(function() {
          newUser = store.createRecord('user', { firstName: 'Tim' });
          newComment = store.createRecord('comment', {
            body: 'This is a new comment'
          });
          newUser.get('comments').pushObject(newComment);
          done();
        });
      });

      afterEach(function() {
        delete app.User;
      });

      it('serializes the hasMany side in a manyToOne relationship', function() {

        var snapshot = newUser._createSnapshot();
        console.log(snapshot);
        var json = serializer.serialize(snapshot);

        var expectedJSON = {
          created: null,
          firstName: 'Tim',
          comments: [newComment.get('id')]
        };

        expect(json.comments).to.be.an('array', 'hasMany relationship should exist');
        expect(json.comments).to.deep.equal(expectedJSON.comments, 'hasMany relationship should contain the right children');
      });

    }); // hasMany relationships

  }); // #serialize()

});
