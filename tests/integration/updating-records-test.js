import Ember from 'ember';
import DS from 'ember-data';
import startApp from 'dummy/tests/helpers/start-app';
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
    Ember.run(app, 'destroy');
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
          // debugger;
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
                expect(snap.val().treeNodes[embeddedId]).to.not.exist;
                done();
              });
            });
          });
        });

      }); // when invoking .save() directly

      describe('inside embedded records', function() {

        var reference, parentRecord, embeddedRecord, parentData, embeddedData,
            doubleEmbeddedId, doubleEmbeddedRecord, doubleEmbeddedData;
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
            doubleEmbeddedRecord = store.createRecord('tree-node', {
              label: 'Child Sub Node'
            });
            parentId = parentRecord.get('id');
            embeddedId = embeddedRecord.get('id');
            doubleEmbeddedId = doubleEmbeddedRecord.get('id');
            embeddedRecord.get('children').addObject(doubleEmbeddedRecord);
            parentRecord.get('children').addObject(embeddedRecord);
            // debugger;
            parentRecord.save().then(function() {
              reference.once('value', function(snapshot) {
                parentData = snapshot.val().treeNodes[parentId];
                embeddedData = parentData.children[embeddedId];
                doubleEmbeddedData = embeddedData.children[doubleEmbeddedId];
                done();
              });
            });
          });
        });

        it('save to server correctly', function() {
          expect(doubleEmbeddedData.label).to.equal('Child Sub Node');
        });

        it('maintain the correct .ref()', function() {
          var refPath = doubleEmbeddedRecord.ref().path.toString();
          var expectedPath = `/blogs/tests/adapter/updaterecord/embedded/treeNodes/${parentId}/children/${embeddedId}/children/${doubleEmbeddedId}`;
          expect(refPath).to.equal(expectedPath);
        });

        it('are not `dirty`', function() {
          expect(doubleEmbeddedRecord.get('hasDirtyAttributes')).to.equal(false, 'The embedded record should not be `dirty`');
        });

        it('are not `new`', function() {
          expect(doubleEmbeddedRecord.get('isNew')).to.equal(false, 'The embedded record should not be `new`');
        });

        it('are not `saving`', function() {
          expect(doubleEmbeddedRecord.get('isSaving')).to.equal(false, 'The embedded record should be `saving`');
        });

        it('become `dirty` when editing', function() {
          doubleEmbeddedRecord.set('label', 'new label');
          expect(doubleEmbeddedRecord.get('hasDirtyAttributes')).to.equal(true, 'The embedded record should be `dirty`');
        });

        it('are not `dirty` after re-saving', function(done) {
          doubleEmbeddedRecord.set('label', 'new label');
          parentRecord.save().then(function () {
            doubleEmbeddedRecord.ref().once('value', function(snapshot) {
              doubleEmbeddedData = snapshot.val();
              expect(doubleEmbeddedData.label).to.equal('new label');
              expect(doubleEmbeddedRecord.get('hasDirtyAttributes')).to.equal(false, 'record should not be dirty');
              done();
            });
          });
        });

        it('rollback to a clean state', function() {
          doubleEmbeddedRecord.set('label', 'new label');
          expect(doubleEmbeddedRecord.get('hasDirtyAttributes')).to.equal(true, 'The embedded record should be `dirty`');

          doubleEmbeddedRecord.rollbackAttributes();
          expect(doubleEmbeddedRecord.get('hasDirtyAttributes')).to.equal(false, 'The embedded record should not be `dirty`');
        });

        it('rollback to their last saved state', function() {
          doubleEmbeddedRecord.set('label', 'new label');
          expect(doubleEmbeddedRecord.get('hasDirtyAttributes')).to.equal(true, 'The embedded record should be `dirty`');

          doubleEmbeddedRecord.rollbackAttributes();
          expect(doubleEmbeddedRecord.get('label')).to.equal('Child Sub Node');
        });

        describe('when invoking .save() directly', function () {

          it('update on the server at the correct location', function(done) {
            Ember.run(() => {
              doubleEmbeddedRecord.set('label', 'Updated');
              doubleEmbeddedRecord.save().then(() => {
                doubleEmbeddedRecord.ref().once('value', function (snap) {
                  expect(snap.val().label).to.equal('Updated');
                  done();
                });
              });
            });
          });

          it('do not duplicate data on the server', function(done) {
            Ember.run(() => {
              doubleEmbeddedRecord.save().then(() => {
                reference.once('value', function (snap) {
                  expect(snap.val().treeNodes[doubleEmbeddedId]).to.not.exist;
                  done();
                });
              });
            });
          });

        }); // when invoking .save() directly

      }); // inside embedded records

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

  });

});
