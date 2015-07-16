/* jshint expr:true */
import { expect } from 'chai';
import {
  describeModule,
  it
} from 'ember-mocha';

import Post from 'dummy/models/post';
import Comment from 'dummy/models/comment';
import User from 'dummy/models/user';
import assign from 'lodash/object/assign';

describeModule(
  'serializer:firebase',
  'FirebaseSerializer',
  {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  },
  function() {
    /*
      Example JSON-API output:

      {
        data: {
          type: 'post',
          id: 'post_1',
          attributes: {
            published: 1395162147646,
            body: 'This is the first FireBlog post!',
            title: 'Post 1'
          },
          relationships: {
            comments: {
              data: [
                { type: 'comment', id: 'comment_1' },
                { type: 'comment', id: 'comment_2' }
              ],
            },
            user: {
              data: { type: 'user', id: 'aputinski' }
            }
          }
        },
        included: [
          {
            id: 'comment_1',
            type: 'comment',
            attributes: { ... },
            relationships: { ... }
          }
        ]
      }
    */

    describe('#_convertBooleanArrayToIds', function () {

      it('converts empty array', function () {
        var serializer = this.subject();
        var result = serializer._convertBooleanArrayToIds([]);

        expect(result).to.deep.equal([]);
      });

      it('ignores falsy values', function () {
        var serializer = this.subject();
        var result = serializer._convertBooleanArrayToIds([null, undefined, false]);

        expect(result).to.deep.equal([]);
      });

      it('converts contiguous indexes to string values', function () {
        var serializer = this.subject();
        var result = serializer._convertBooleanArrayToIds([true, true, true]);

        expect(result).to.deep.equal(['0', '1', '2']);
      });

      it('ignores interim falsy values', function () {
        var serializer = this.subject();
        var result = serializer._convertBooleanArrayToIds([true, undefined, false, true]);

        expect(result).to.deep.equal(['0', '3']);
      });

      it('ignores trailing falsy values', function () {
        var serializer = this.subject();
        var result = serializer._convertBooleanArrayToIds([true, undefined, false]);

        expect(result).to.have.length(1);
      });

      it('ignores leading falsy values', function () {
        var serializer = this.subject();
        var result = serializer._convertBooleanArrayToIds([undefined, false, true]);

        expect(result).to.have.length(1);
      });

    }); // #_convertBooleanArrayToIds


    describe('#_addNumericIdsToEmbeddedArray', function () {

      it('converts empty array', function () {
        var serializer = this.subject();
        var result = serializer._addNumericIdsToEmbeddedArray([]);

        expect(result).to.deep.equal([]);
      });

      it('ignores falsy values', function () {
        var serializer = this.subject();
        var result = serializer._addNumericIdsToEmbeddedArray([null, undefined, false]);

        expect(result).to.deep.equal([]);
      });

      it('assigns array index to object as `id` property', function () {
        var serializer = this.subject();
        var result = serializer._addNumericIdsToEmbeddedArray([
          { title: 'a' },
          { title: 'b' }
        ]);

        expect(result).to.deep.equal([
          { id: '0', title: 'a' },
          { id: '1', title: 'b' }
        ]);
      });

      it('assigns array index to object as a string', function () {
        var serializer = this.subject();
        var result = serializer._addNumericIdsToEmbeddedArray([
          { title: 'a' }
        ]);

        expect(result[0].id).to.be.a('string');
      });

      it('ignores interim values', function () {
        var serializer = this.subject();
        var result = serializer._addNumericIdsToEmbeddedArray([{}, undefined, null, {}]);

        expect(result).to.deep.equal([
          { id: '0' },
          { id: '3' }
        ]);
      });

      it('ignores trailing falsy values', function () {
        var serializer = this.subject();
        var result = serializer._addNumericIdsToEmbeddedArray([{}, undefined, null]);

        expect(result).to.have.length(1);
      });

      it('ignores leading falsy values', function () {
        var serializer = this.subject();
        var result = serializer._addNumericIdsToEmbeddedArray([undefined, null, {}]);

        expect(result).to.have.length(1);
      });

    }); // #_addNumericIdsToEmbeddedArray

    describe('#normalize', function () {

      describe('normalized relationships', function() {

        var postPayload;

        beforeEach(function() {
          Post.modelName = 'post';

          postPayload = {
            id: 'post_1',
            published: 1395162147646,
            user: 'aputinski',
            body: 'This is the first FireBlog post!',
            comments: {
              comment_1: true,
              comment_2: true
            },
            title: 'Post 1'
          };
        });

        afterEach(function() {
          delete Post.modelName;
        });

        it('normalizes id correctly', function() {
          var serializer = this.subject();
          var { data } = serializer.normalize(Post, postPayload);

          expect(data.id).to.equal('post_1');
        });

        it('normalizes type correctly', function() {
          var serializer = this.subject();
          var { data } = serializer.normalize(Post, postPayload);

          expect(data.type).to.equal('post');
        });

        it('normalizes attributes correctly', function() {
          var serializer = this.subject();
          var { data } = serializer.normalize(Post, postPayload);

          expect(data.attributes).to.deep.equal({
            published: 1395162147646,
            body: 'This is the first FireBlog post!',
            title: 'Post 1'
          });
        });

        it('normalizes `hasMany` relationships correctly', function() {
          var serializer = this.subject();
          var { data } = serializer.normalize(Post, postPayload);

          expect(data.relationships.comments).to.deep.equal({
            data: [
              { type: 'comment', id: 'comment_1' },
              { type: 'comment', id: 'comment_2' }
            ],
          });
        });

        it('normalizes `belongsTo` relationships correctly', function() {
          var serializer = this.subject();
          var { data } = serializer.normalize(Post, postPayload);

          expect(data.relationships.user).to.deep.equal({
            data: { type: 'user', id: 'aputinski' }
          });
        });

        it('normalizes empty `hasMany` relationship when property is omitted by server', function() {
          var serializer = this.subject();
          var { data } = serializer.normalize(Post, {
            id: 'post_1',
            published: 1395162147646,
            user: 'aputinski',
            body: 'This is the first FireBlog post!',
            title: 'Post 1'
          });

          expect(data.relationships.comments).to.deep.equal({
            data: []
          });
        });

      }); // normalized relationships

      describe('invalid data', function () {

        it('throws an error when hasMany relationship info is malformed', function() {
          var invalidPayload = assign({
            id: 'post_1',
            published: 1395162147646,
            user: 'aputinski',
            body: 'This is the first FireBlog post!',
            comments: ['comment_1', 'comment_2'],
            title: 'Post 1'
          });
          var serializer = this.subject();

          expect(function() {
            serializer.normalize(Post, invalidPayload);
          }).to.throw(Error);
        });
      }); // invalid data

      describe('embedded `hasMany` relationships', function() {

        var postPayload = {
          id: 'post_1',
          published: 1395162147646,
          user: 'aputinski',
          body: 'This is the first FireBlog post!',
          comments: {
            comment_1: {
              published: 1395176007623,
              user: 'aputinski',
              body: 'This is a comment'
            },
            comment_2: {
              published: 1395176007624,
              user: 'aputinski',
              body: 'This is a second comment'
            }
          },
          title: 'Post 1'
        };
        var serializer;

        beforeEach(function () {
          serializer = this.subject();

          // enable embedded comments
          serializer.set('attrs', { comments: { embedded: 'always' } });

          // mock out the store
          serializer.store = {
            modelFor: function () {
              Comment.modelName = 'comment';
              return Comment;
            },
            serializerFor: function () {
              return serializer;
            }
          };
        });

        afterEach(function () {
          delete Comment.modelName;
        });

        it('normalizes id correctly', function() {
          var { data } = serializer.normalize(Post, postPayload);

          expect(data.id).to.equal('post_1');
        });

        it('normalizes attributes correctly', function() {
          var { data } = serializer.normalize(Post, postPayload);

          expect(data.attributes).to.deep.equal({
            published: 1395162147646,
            body: 'This is the first FireBlog post!',
            title: 'Post 1'
          });
        });

        it('normalizes relationships correctly', function() {
          var { data } = serializer.normalize(Post, postPayload);

          expect(data.relationships.comments.data).to.deep.equal([
            { type: 'comment', id: 'comment_1' },
            { type: 'comment', id: 'comment_2' }
          ]);
        });

        it('includes embedded data in `payload.included`', function() {
          var json = serializer.normalize(Post, postPayload);

          expect(json.included).to.have.length(2);
          expect(json.included[0].attributes).to.deep.equal({
            published: 1395176007623,
            body: 'This is a comment'
          });

          expect(json.included[1].id).to.equal('comment_2');
        });

      }); // embedded `hasMany` relationships


      describe('embedded `belongsTo` relationships', function() {

        var commentPayload;
        var serializer;

        beforeEach(function () {
          commentPayload = {
            id: 'comment_1',
            published: 1395162147646,
            user: {
              id: 'aputinski',
              firstName: 'Adam'
            },
            body: 'This is a comment'
          };

          serializer = this.subject();

          // enable embedded user
          serializer.set('attrs', {
            user: {
              key: 'user',
              embedded: 'always'
            }
          });

          // mock out the store
          serializer.store = {
            modelFor: function () {
              User.modelName = 'user';
              return User;
            },
            serializerFor: function () {
              return serializer;
            }
          };
        });

        afterEach(function () {
          delete User.modelName;
        });

        it('normalizes id correctly', function() {
          var { data } = serializer.normalize(Comment, commentPayload);

          expect(data.id).to.equal('comment_1');
        });

        it('normalizes attributes correctly', function() {
          var { data } = serializer.normalize(Comment, commentPayload);

          expect(data.attributes).to.deep.equal({
            body: 'This is a comment',
            published: 1395162147646
          });
        });

        it('normalizes relationships correctly', function() {
          var { data } = serializer.normalize(Comment, commentPayload);

          expect(data.relationships.user.data).to.deep.equal({
            type: 'user', id: 'aputinski'
          });
        });

        it('includes embedded data in `payload.included`', function() {
          var json = serializer.normalize(Comment, commentPayload);

          expect(json.included).to.have.length(1);
          expect(json.included[0].attributes).to.deep.equal({
            firstName: 'Adam'
          });

          expect(json.included[0].id).to.equal('aputinski');
        });

      }); // embedded `belongsTo` relationships

    }); // #normalize

    xdescribe('#normalizeResponse', function() {
      var commentPayload;
      var serializer;
      var store;

      beforeEach(function () {
        commentPayload = {
          id: 'comment_1',
          published: 1395162147646,
          user: {
            id: 'aputinski',
            firstName: 'Adam'
          },
          body: 'This is a comment'
        };

        serializer = this.subject();

        // enable embedded user
        serializer.set('attrs', {
          user: {
            key: 'user',
            embedded: 'always'
          }
        });

        // mock out the store
        store = {
          modelFor: function () {
            User.modelName = 'user';
            return User;
          },
          serializerFor: function () {
            return serializer;
          }
        };

        serializer.store = store;
      });

      afterEach(function () {
        delete User.modelName;
      });

      it('includes embedded data in `payload.included`', function() {
        var json = serializer.normalizeResponse(store, Comment, commentPayload, 'comment_1', 'findRecord');

        expect(json.included).to.have.length(1);
        expect(json.included[0].attributes).to.deep.equal({
          firstName: 'Adam'
        });

        expect(json.included[0].id).to.equal('aputinski');
      });

    }); // #normalizeResponse

  }
);
