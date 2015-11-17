import Ember from 'ember';
import DS from 'ember-data';
import setupStore from 'dummy/tests/helpers/setup-store';
import { it } from 'ember-mocha';
import FirebaseSerializer from 'emberfire/serializers/firebase';

var run = Ember.run;

describe('Integration: FirebaseSerializer - Serializing records', function() {
  var Post, post, Comment, comment, env;

  beforeEach(function() {
    Comment = DS.Model.extend({
      body: DS.attr('string'),
      published: DS.attr('number'),
    });

    Post = DS.Model.extend({
      title: DS.attr('string'),
      body: DS.attr('string'),
      published: DS.attr('number'),
      comments: DS.hasMany('comment', { async: true })
    });

    env = setupStore({
      comment: Comment,
      post: Post
    });
    env.store.modelFor('comment');
    env.store.modelFor('post');

    env.registry.register('serializer:application', FirebaseSerializer);
  });

  afterEach(function() {
    run(env.store, 'destroy');
  });

  describe('#serialize()', function() {

    describe('hasMany relationships (manyToOne)', function() {

      var serializer;

      beforeEach(function() {
        serializer = env.store.serializerFor('post');

        run(function() {
          comment = env.store.createRecord('comment', {
            id: 'comment_1',
            body: 'This is a new comment'
          });
          post = env.store.createRecord('post', { tile: 'New Post' });
          post.get('comments').pushObject(comment);
        });
      });

      it('serializes as an object', function() {
        var snapshot = post._createSnapshot();
        var json = serializer.serialize(snapshot);

        expect(json.comments).to.be.an('object',
            'hasMany relationship should be an object');
      });

      it('serializes each link as a boolean value', function() {
        var snapshot = post._createSnapshot();
        var json = serializer.serialize(snapshot);

        var expectedJSON = {
          created: null,
          firstName: 'New Post',
          comments: {
            [comment.get('id')]: true
          }
        };

        expect(json.comments).to.deep.equal(expectedJSON.comments,
            'hasMany relationship should contain boolean links');
      });

    }); // hasMany relationships (manyToOne)

    describe('hasMany relationships (embedded)', function() {
      var serializer;

      beforeEach(function() {
        env.registry.register('serializer:post', FirebaseSerializer.extend({
          attrs: {
            comments: { embedded: 'always' }
          }
        }));

        serializer = env.store.serializerFor('post');

        run(function() {
          comment = env.store.createRecord('comment', {
            id: 'comment_1',
            body: 'This is a new comment'
          });
          post = env.store.createRecord('post', { tile: 'New Post' });
          post.get('comments').pushObject(comment);
        });
      });

      it('serializes as an object', function() {
        var snapshot = post._createSnapshot();
        var json = serializer.serialize(snapshot);

        expect(json.comments).to.be.an('object',
            'hasMany relationship should be an object');
      });

      it('embeds the child object correctly', function() {
        var snapshot = post._createSnapshot();
        var json = serializer.serialize(snapshot);

        var expectedJSON = {
          created: null,
          firstName: 'New Post',
          comments: {
            [comment.get('id')]: {
              id: 'comment_1',
              body: 'This is a new comment',
              published: null
            }
          }
        };

        expect(json.comments.comment_1).to.deep.equal(expectedJSON.comments.comment_1,
            'hasMany relationship should contain the full object');
      });

    }); // hasMany relationships (embedded)

  }); // #serialize()

});
