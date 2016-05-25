import Ember from 'ember';
import DS from 'ember-data';
import startApp from 'dummy/tests/helpers/start-app';
import destroyApp from 'dummy/tests/helpers/destroy-app';
import { it } from 'ember-mocha';
import stubFirebase from 'dummy/tests/helpers/stub-firebase';
import unstubFirebase from 'dummy/tests/helpers/unstub-firebase';
import createTestRef from 'dummy/tests/helpers/create-test-ref';

describe('Integration: FirebaseAdapter - Updating records', function() {
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
    destroyApp(app);
    unstubFirebase();
  });

  describe('#updateRecord()', function() {

    describe('normalized hasMany relationships', function() {
      var reference, newPost, newComment, currentData, postData, postId, commentId;

      beforeEach(function(done) {
        reference = firebaseTestRef.child('normalized');
        adapter._ref = reference;
        Ember.run(function() {
          newComment = store.createRecord('comment', {
            body: 'This is a new comment'
          });
          newPost = store.createRecord('post', {
            title: 'New Post'
          });

          postId = newPost.get('id');
          commentId = newComment.get('id');
          done();
        });
      });

      describe('when the child record has been saved', function () {

        it('writes the hasMany relationship link', function(done) {
          Ember.run(function () {
            newComment.save().then(function (c) {
              Ember.RSVP.Promise.cast(newPost.get('comments')).then(function(comments) {
                comments.pushObject(newComment);
                newPost.save().then(function() {
                  reference.once('value', function(data) {
                    currentData = data.val();
                    postData = currentData.posts[postId];

                    expect(postData.comments[commentId]).to.equal(true, 'the hasMany link should exist');
                    expect(postData.comments).to.be.an('object');

                    done();
                   });
                });
              });
            });
          });
        });

        it('removed the null belongsTo reference from the final payload', function() {
          expect(postData.user).to.not.exist;
        });

        describe('and the child is dirty', function () {

          it('writes the hasMany relationship link', function(done) {
            Ember.run(function () {
              newComment.save().then(function () {
                newComment.set('body', 'dirty this record!');
                expect(newComment.get('hasDirtyAttributes')).to.equal(true, 'the item should be dirty');
                expect(newComment.get('isNew')).to.equal(false, 'the item should not be `new`');

                Ember.RSVP.Promise.cast(newPost.get('comments')).then(function(comments) {
                  comments.pushObject(newComment);
                  newPost.save().then(function() {
                    reference.once('value', function(data) {
                      currentData = data.val();
                      postData = currentData.posts[postId];

                      expect(postData.comments[commentId]).to.equal(true, 'the hasMany link should exist');

                      done();
                     });
                  });
                });
              });
            });
          });

        }); // and the child is dirty

      }); // when the child record has been saved

      describe('when a child record is removed', function () {
        var secondComment, secondCommentId;

        beforeEach(function (done) {
          Ember.run(function () {
            secondComment = store.createRecord('comment', {
              body: 'This is a new comment'
            });
            secondCommentId = secondComment.get('id');

            Ember.RSVP.all([newComment.save(), secondComment.save()]).then(function () {
              Ember.RSVP.Promise.cast(newPost.get('comments')).then(function(comments) {
                comments.pushObject(newComment);
                comments.pushObject(secondComment);
                newPost.save().then(function() {
                  reference.once('value', function(data) {
                    currentData = data.val();
                    postData = currentData.posts[postId];
                    done();
                  });
                });
              });
            });
          });
        });

        it('removes only one hasMany link', function(done) {
          expect(postData.comments[commentId]).to.equal(true, 'the first hasMany link should exist before removal');
          expect(postData.comments[secondCommentId]).to.equal(true, 'the second hasMany link should exist before removal');

          Ember.RSVP.Promise.cast(newPost.get('comments')).then(function(comments) {
            comments.removeObject(secondComment);
            newPost.save().then(function() {
              reference.once('value', function(data) {
                currentData = data.val();
                postData = currentData.posts[postId];

                expect(postData.comments[commentId]).to.equal(true, 'the first hasMany link should still exist');
                expect(postData.comments[secondCommentId]).to.be.an('undefined', 'the second hasMany link should be removed');

                done();
              });
            });
          });
        });

        it('removes the comments hash if no hasMany records remain', function(done) {
          expect(postData.comments[commentId]).to.equal(true, 'the first hasMany link should exist before removal');
          expect(postData.comments[secondCommentId]).to.equal(true, 'the second hasMany link should exist before removal');

          Ember.RSVP.Promise.cast(newPost.get('comments')).then(function(comments) {
            comments.removeObject(newComment);
            comments.removeObject(secondComment);
            newPost.save().then(function() {
              reference.once('value', function(data) {
                currentData = data.val();
                postData = currentData.posts[postId];

                expect(postData.comments).to.be.an('undefined', 'the `comments` hash should be removed');

                done();
              });
            });
          });
        });

      }); // when a child record is removed

    }); // normalized hasMany relationships

    describe('relationships with number ids', function() {
      var newPost, newComment, postId, commentId;

      beforeEach(function(done) {
        var reference = firebaseTestRef.child('normalized');
        adapter._ref = reference;
        Ember.run(function() {
          newComment = store.createRecord('comment', {
            id: 1,
            body: 'This is a new comment'
          });
          newPost = store.createRecord('post', {
            title: 'New Post'
          });
          postId = newPost.get('id');
          commentId = newComment.get('id');
          newComment.save();
          Ember.RSVP.all([newComment.save(), newPost.get('comments')]).then(function(promises) {
            var comments = promises[1];
            comments.pushObject(newComment);
            newPost.save().then(function() {
              return newPost.reload().then(function() {
                done();
              });
            });
          });
        });
      });

      it('contains a hasMany relationship', function(done) {
        newPost.get('comments').then(function(comments) {
          expect(comments.objectAt(0).get('body')).to.equal('This is a new comment');
          done();
        });
      });

    });

    describe('multiple normalized relationships', function() {

      var newPost1, newPost2, newPost3, newComment, newUser;

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
          comments: DS.hasMany('comment', { async: true, inverse:'user' })
        });

        adapter._ref = firebaseTestRef.child('normalized');

        Ember.run(function() {
          newUser = store.createRecord('user');
          newComment = store.createRecord('comment', {
            body: 'This is a new comment'
          });
          newPost1 = store.createRecord('post', {
            title: 'Post 1'
          });
          newPost2 = store.createRecord('post', {
            title: 'Post 2'
          });
          newPost3 = store.createRecord('post', {
            title: 'Post 3'
          });
          newUser.get('posts').then(function(posts) {
            posts.pushObjects([newPost1, newPost2, newPost3]);
            newUser.save().then(function() {
              return Ember.RSVP.all([newPost1.save(), newPost2.save(), newPost3.save()]);
            }).then(function(){
              done();
            });
          });
        });
      });

      afterEach(function() {
        delete app.User;
      });

      it('adds a comment without removing old posts', function(done) {
        Ember.run(function() {
          newUser.get('comments').then(function(comments) {
            var posts;
            comments.addObject(newComment);
            newUser.save().then(function() {
              return newComment.save();
            }).then(function() {
              return newUser.get('posts').then(function(ps) {
                posts = ps;
              });
            }).then(function() {
              expect(Ember.A(posts).contains(newPost1)).to.equal(true);
              expect(Ember.A(posts).contains(newPost2)).to.equal(true);
              expect(Ember.A(posts).contains(newPost3)).to.equal(true);
              done();
            });
          });
        });
      });

    });

    describe('embedded hasMany records', function() {

      var reference, parentRecord, embeddedRecord, parentData, embeddedData;
      var parentId, embeddedId;

      beforeEach(function(done) {
        reference = firebaseTestRef.child('embedded');
        adapter._ref = reference;
        Ember.run(function() {
          parentRecord = store.createRecord('tree-node', {
            label: 'Parent Node'
          });
          embeddedRecord = store.createRecord('tree-node', {
            label: 'Child Node'
          });
          parentId = parentRecord.get('id');
          embeddedId = embeddedRecord.get('id');
          parentRecord.get('children').addObject(embeddedRecord);
          parentRecord.save().then(function() {
            reference.once('value', function(snapshot) {
              parentData = snapshot.val().treeNodes[parentId];
              embeddedData = parentData.children[embeddedId];
              done();
            });
          });
        });
      });

      it('save to server correctly', function() {
        expect(embeddedData.label).to.equal('Child Node');
      });

      it('maintain the correct .ref()', function() {
        var refPath = embeddedRecord.ref().path.toString();
        var expectedPath = `/blogs/tests/adapter/updaterecord/embedded/treeNodes/${parentId}/children/${embeddedId}`;
        expect(refPath).to.equal(expectedPath);
      });

      it('are not `dirty`', function() {
        expect(embeddedRecord.get('hasDirtyAttributes')).to.equal(false, 'The embedded record should not be `dirty`');
      });

      it('are not `new`', function() {
        expect(embeddedRecord.get('isNew')).to.equal(false, 'The embedded record should not be `new`');
      });

      it('are not `saving`', function() {
        expect(embeddedRecord.get('isSaving')).to.equal(false, 'The embedded record should be `saving`');
      });

      it('become `dirty` when editing', function() {
        embeddedRecord.set('label', 'new label');
        expect(embeddedRecord.get('hasDirtyAttributes')).to.equal(true, 'The embedded record should be `dirty`');
      });

      it('are not `dirty` after re-saving', function(done) {
        embeddedRecord.set('label', 'new label');
        parentRecord.save().then(function () {
          embeddedRecord.ref().once('value', function(snapshot) {
            embeddedData = snapshot.val();
            expect(embeddedData.label).to.equal('new label');
            expect(embeddedRecord.get('hasDirtyAttributes')).to.equal(false, 'record should not be dirty');
            done();
          });
        });
      });

      it('rollback to a clean state', function() {
        embeddedRecord.set('label', 'new label');
        expect(embeddedRecord.get('hasDirtyAttributes')).to.equal(true, 'The embedded record should be `dirty`');

        embeddedRecord.rollbackAttributes();
        expect(embeddedRecord.get('hasDirtyAttributes')).to.equal(false, 'The embedded record should not be `dirty`');
      });

      it('rollback to their last saved state', function() {
        embeddedRecord.set('label', 'new label');
        expect(embeddedRecord.get('hasDirtyAttributes')).to.equal(true, 'The embedded record should be `dirty`');

        embeddedRecord.rollbackAttributes();
        expect(embeddedRecord.get('label')).to.equal('Child Node');
      });

      describe('when invoking .save() directly', function () {

        it('update on the server at the correct location', function(done) {
          Ember.run(() => {
            embeddedRecord.set('label', 'Updated');
            embeddedRecord.save().then(() => {
              embeddedRecord.ref().once('value', function (snap) {
                expect(snap.val().label).to.equal('Updated');
                done();
              });
            });
          });
        });

        it('do not duplicate data on the server', function(done) {
          Ember.run(() => {
            embeddedRecord.save().then(() => {
              reference.once('value', function (snap) {
                expect(snap.val().children).to.not.exist;
                done();
              });
            });
          });
        });

      }); // when invoking .save() directly

    }); // embedded hasMany records

    describe('embedded belongsTo records', function() {

      var reference, parentRecord, embeddedRecord, parentData, embeddedData;
      var parentId, embeddedId;

      beforeEach(function(done) {
        reference = firebaseTestRef.child('embedded');
        adapter._ref = reference;
        Ember.run(function() {
          parentRecord = store.createRecord('tree-node', {
            label: 'Parent'
          });
          embeddedRecord = store.createRecord('tree-node-config', {
            sync: true
          });
          parentId = parentRecord.get('id');
          embeddedId = embeddedRecord.get('id');
          parentRecord.set('config', embeddedRecord);
          parentRecord.save().then(function() {
            reference.once('value', function(data) {
              parentData = data.val().treeNodes[parentId];
              embeddedData = parentData.config;
              done();
             });
          });
        });
      });

      it('save to server correctly', function() {
        expect(embeddedData.sync).to.be.true;
      });

      it('maintain the correct .ref()', function() {
        var refPath = embeddedRecord.ref().path.toString();
        var expectedPath = `/blogs/tests/adapter/updaterecord/embedded/treeNodes/${parentId}/config`;
        expect(refPath).to.equal(expectedPath);
      });

      it('save with an id', function() {
        expect(embeddedData.id).to.equal(embeddedId, 'The id should exist in the embedded payload');
      });

      it('are not `dirty`', function() {
        expect(embeddedRecord.get('hasDirtyAttributes')).to.equal(false, 'The embedded record should not be `dirty`');
      });

      it('are not `new`', function() {
        expect(embeddedRecord.get('isNew')).to.equal(false, 'The embedded record should not be `new`');
      });

      it('are not `saving`', function() {
        expect(embeddedRecord.get('isSaving')).to.equal(false, 'The embedded record should be `saving`');
      });

      it('become `dirty` when editing', function() {
        embeddedRecord.set('sync', false);
        expect(embeddedRecord.get('hasDirtyAttributes')).to.equal(true, 'The embedded record should be `dirty`');
      });

      it('are not `dirty` after re-saving', function(done) {
        embeddedRecord.set('sync', false);
        parentRecord.save().then(function () {
          embeddedRecord.ref().once('value', function(snapshot) {
            expect(snapshot.val().sync).to.be.false;
            expect(embeddedRecord.get('hasDirtyAttributes')).to.equal(false, 'record should not be dirty');
            done();
          });
        });
      });

      it('rollback to a clean state', function() {
        embeddedRecord.set('sync', false);
        expect(embeddedRecord.get('hasDirtyAttributes')).to.equal(true, 'The embedded record should be `dirty`');

        embeddedRecord.rollbackAttributes();
        expect(embeddedRecord.get('hasDirtyAttributes')).to.equal(false, 'The embedded record should not be `dirty`');
      });

      it('rollback to their last saved state', function() {
        embeddedRecord.set('sync', false);
        expect(embeddedRecord.get('hasDirtyAttributes')).to.equal(true, 'The embedded record should be `dirty`');

        embeddedRecord.rollbackAttributes();
        expect(embeddedRecord.get('sync')).to.be.true;
      });

      describe('when invoking .save() directly', function () {

        it('update on the server at the correct location', function(done) {
          Ember.run(() => {
            embeddedRecord.set('sync', false);
            embeddedRecord.save().then(() => {
              embeddedRecord.ref().once('value', function (snap) {
                expect(snap.val().sync).to.be.false;
                done();
              });
            });
          });
        });

        it('do not duplicate data on the server', function(done) {
          Ember.run(() => {
            embeddedRecord.save().then(() => {
              reference.once('value', function (snap) {
                expect(snap.val().treeNodeConfigs).to.not.exist;
                done();
              });
            });
          });
        });

      }); // when invoking .save() directly

    }); // embedded belongsTo records

    describe('when keyForRelationship is overwritten in serializer', function() {
      it('adds belongsTo', function(done) {
        const reference = firebaseTestRef.child('CapitalizedRelations');
        adapter._ref = reference;
        store.serializerFor('application').keyForRelationship = function(key) {
          return Ember.String.capitalize(key);
        };

        Ember.run(function() {
          let user = store.createRecord('user', {
            firstName: 'John'
          });

          let newPost = store.createRecord('post', {
            title: 'New Post',
            user: user
          });

          newPost.save().then(() => {
            reference.once('value', fbSnapshot => {
              const postData = fbSnapshot.val().posts[newPost.get('id')];
              expect(postData.User).to.equal(user.get('id'));
              done();
            });
          });
        });
      });

      it('adds hasMany', function(done) {
        const reference = firebaseTestRef.child('CapitalizedRelations');
        adapter._ref = reference;
        store.serializerFor('application').keyForRelationship = function(key) {
          return Ember.String.capitalize(key);
        };

        Ember.run(function() {
          let post = store.createRecord('post', {
            title: 'New Post'
          });

          let comment = store.createRecord('comment', {
            body: 'A comment'
          });

          post.save().then(() => {
            return comment.save();
          }).then(() => {
            post.set('comments', [comment]);
            return post.save();
          }).then(() => {
            reference.once('value', fbSnapshot => {
              const postData = fbSnapshot.val().posts[post.get('id')];
              expect(postData.Comments).to.have.all.keys([comment.get('id')]);
              done();
            });
          });
        });
      });

      it('removes hasMany', function(done) {
        const reference = firebaseTestRef.child('CapitalizedRelations');
        adapter._ref = reference;
        store.serializerFor('application').keyForRelationship = function(key) {
          return Ember.String.capitalize(key);
        };

        Ember.run(function() {
          let post = store.createRecord('post', {
            title: 'New Post'
          });

          let commentA = store.createRecord('comment', {
            body: 'A comment'
          });

          let commentB = store.createRecord('comment', {
            body: 'Another comment'
          });

          post.save().then(() => {
            return Ember.RSVP.all([
              commentA.save(),
              commentB.save()
            ]);
          }).then(() => {
            post.set('comments', [commentA, commentB]);
            return post.save();
          }).then(() => {
            post.set('comments', [commentA]);
            return post.save();
          }).then(() => {
            reference.once('value', fbSnapshot => {
              const postData = fbSnapshot.val().posts[post.get('id')];
              expect(postData.Comments).to.not.have.all.keys([commentB.get('id')]);
              done();
            });
          });
        });
      });

      it('saves embedded hasMany', function(done) {
        const reference = firebaseTestRef.child('CapitalizedRelations');
        adapter._ref = reference;
        store.serializerFor('tree-node').keyForRelationship = function(key) {
          return Ember.String.capitalize(key);
        };

        Ember.run(function() {
          let parentRecord = store.createRecord('tree-node', {
            label: 'Parent Node'
          });
          let embeddedRecord = store.createRecord('tree-node', {
            label: 'Child Node'
          });

          const parentId = parentRecord.get('id');
          const embeddedId = embeddedRecord.get('id');
          parentRecord.get('children').addObject(embeddedRecord);
          parentRecord.save().then(function() {
            reference.once('value', function(snapshot) {
              const parentData = snapshot.val().treeNodes[parentId];
              expect(parentData.Children).to.have.all.keys(embeddedId);
              done();
            });
          });
        });
      });

      it('removes embedded hasMany', function(done) {
        const reference = firebaseTestRef.child('CapitalizedRelations');
        adapter._ref = reference;
        store.serializerFor('tree-node').keyForRelationship = function(key) {
          return Ember.String.capitalize(key);
        };

        Ember.run(function() {
          let parentRecord = store.createRecord('tree-node', {
            label: 'Parent Node'
          });

          let embeddedRecordA = store.createRecord('tree-node', {
            label: 'Child Node'
          });

          let embeddedRecordB = store.createRecord('tree-node', {
            label: 'Another Child Node'
          });

          const parentId = parentRecord.get('id');
          const embeddedId = embeddedRecordB.get('id');
          parentRecord.get('children').addObjects([embeddedRecordA, embeddedRecordB]);
          parentRecord.save().then(() => {
            embeddedRecordB.destroyRecord();
            return parentRecord.save();
          }).then(function() {
            reference.once('value', function(snapshot) {
              const parentData = snapshot.val().treeNodes[parentId];
              expect(parentData.Children).to.not.have.all.keys(embeddedId);
              done();
            });
          });
        });
      });

      it('saves embedded belongsTo', function(done) {
        const reference = firebaseTestRef.child('CapitalizedRelations');
        adapter._ref = reference;
        store.serializerFor('tree-node').keyForRelationship = function(key) {
          return Ember.String.capitalize(key);
        };

        Ember.run(function() {
          let parentRecord = store.createRecord('tree-node', {
            label: 'Parent'
          });
          let embeddedRecord = store.createRecord('tree-node-config', {
            sync: true
          });
          const parentId = parentRecord.get('id');
          const embeddedId = embeddedRecord.get('id');
          parentRecord.set('config', embeddedRecord);
          parentRecord.save().then(function() {
            reference.once('value', function(data) {
              const parentData = data.val().treeNodes[parentId];
              expect(parentData.Config).to.deep.equal({
                id: embeddedId,
                sync: true
              });
              done();
             });
          });
        });
      });
    });
  });
});
