import Ember from 'ember';
import DS from 'ember-data';
import startApp from 'dummy/tests/helpers/start-app';
import { it } from 'ember-mocha';
import stubFirebase from 'dummy/tests/helpers/stub-firebase';
import unstubFirebase from 'dummy/tests/helpers/unstub-firebase';
import createTestRef from 'dummy/tests/helpers/create-test-ref';

describe("Integration: FirebaseAdapter - Updating records", function() {
  var app, store, adapter, firebaseTestRef;

  var setupAdapter = function() {
    app = startApp();
    store = app.__container__.lookup("store:main");
    adapter = store.adapterFor('application');
    adapter._ref = createTestRef("blogs/normalized");
    adapter._queueFlushDelay = false;
    firebaseTestRef = createTestRef("blogs/tests/adapter/updaterecord");
  };

  beforeEach(function () {
    stubFirebase();
    setupAdapter();
  });

  afterEach(function() {
    Ember.run(app, 'destroy');
    unstubFirebase();
  });

  describe("#updateRecord()", function() {

    describe("normalized hasMany relationships", function() {
      var reference, newPost, newComment, currentData, postData, postId, commentId;

      beforeEach(function(done) {
        reference = firebaseTestRef.child("normalized");
        adapter._ref = reference;
        Ember.run(function() {
          newComment = store.createRecord("comment", {
            body: "This is a new comment"
          });
          newPost = store.createRecord("post", {
            title: "New Post"
          });

          postId = newPost.get('id');
          commentId = newComment.get('id');
          done();
        });
      });

      describe('when the child record has not been saved', function () {

        // TODO: disabled until next release
        xit("avoids writing the hasMany relationship link", function(done) {
          Ember.RSVP.Promise.cast(newPost.get("comments")).then(function(comments) {
            assert(newComment.get('isDirty'), 'the item should be dirty');
            assert(newComment.get('isNew'), 'the item should be `new`');

            comments.pushObject(newComment);

            newPost.save().then(function() {
              reference.once('value', function(data) {
                currentData = data.val();
                postData = currentData.posts[postId];

                assert(typeof postData.comments === 'undefined', 'the hasMany link should not exist');

                done();
               });
            });
          });
        });

      }); // when the child record has not been saved

      describe('when the child record has been saved', function () {

        it("writes the hasMany relationship link", function(done) {
          Ember.run(function () {
            newComment.save().then(function (c) {
              Ember.RSVP.Promise.cast(newPost.get("comments")).then(function(comments) {
                comments.pushObject(newComment);
                newPost.save().then(function() {
                  reference.once('value', function(data) {
                    currentData = data.val();
                    postData = currentData.posts[postId];

                    assert(postData.comments[commentId] === true, 'the hasMany link should exist');
                    assert(Ember.isArray(postData.comments) === false);

                    done();
                   });
                });
              });
            });
          });
        });

        it("removed the null belongsTo reference from the final payload", function() {
          assert(postData.user === undefined);
        });

        describe('and the child is dirty', function () {

          it("writes the hasMany relationship link", function(done) {
            Ember.run(function () {
              newComment.save().then(function () {
                newComment.set('body', 'dirty this record!');
                assert(newComment.get('isDirty'), 'the item should be dirty');
                assert(!newComment.get('isNew'), 'the item should not be `new`');

                Ember.RSVP.Promise.cast(newPost.get("comments")).then(function(comments) {
                  comments.pushObject(newComment);
                  newPost.save().then(function() {
                    reference.once('value', function(data) {
                      currentData = data.val();
                      postData = currentData.posts[postId];

                      assert(postData.comments[commentId] === true, 'the hasMany link should exist');

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
            secondComment = store.createRecord("comment", {
              body: "This is a new comment"
            });
            secondCommentId = secondComment.get('id');

            Ember.RSVP.all([newComment.save(), secondComment.save()]).then(function () {
              Ember.RSVP.Promise.cast(newPost.get("comments")).then(function(comments) {
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

        it("removes only one hasMany link", function(done) {
          assert(postData.comments[commentId] === true, 'the first hasMany link should exist before removal');
          assert(postData.comments[secondCommentId] === true, 'the second hasMany link should exist before removal');

          Ember.RSVP.Promise.cast(newPost.get("comments")).then(function(comments) {
            comments.removeObject(secondComment);
            newPost.save().then(function() {
              reference.once('value', function(data) {
                currentData = data.val();
                postData = currentData.posts[postId];

                assert(postData.comments[commentId] === true, 'the first hasMany link should still exist');
                assert(typeof postData.comments[secondCommentId] === 'undefined', 'the second hasMany link should be removed');

                done();
              });
            });
          });
        });

        it("removes the comments hash if no hasMany records remain", function(done) {
          assert(postData.comments[commentId] === true, 'the first hasMany link should exist before removal');
          assert(postData.comments[secondCommentId] === true, 'the second hasMany link should exist before removal');

          Ember.RSVP.Promise.cast(newPost.get("comments")).then(function(comments) {
            comments.removeObject(newComment);
            comments.removeObject(secondComment);
            newPost.save().then(function() {
              reference.once('value', function(data) {
                currentData = data.val();
                postData = currentData.posts[postId];

                assert(typeof postData.comments === 'undefined', 'the `comments` hash should be removed');

                done();
              });
            });
          });
        });

      }); // when a child record is removed

    }); // normalized hasMany relationships

    describe("relationships with number ids", function() {
      var newPost, newComment, postId, commentId;

      beforeEach(function(done) {
        var reference = firebaseTestRef.child("normalized");
        adapter._ref = reference;
        Ember.run(function() {
          newComment = store.createRecord("comment", {
            id: 1,
            body: "This is a new comment"
          });
          newPost = store.createRecord("post", {
            title: "New Post"
          });
          postId = newPost.get('id');
          commentId = newComment.get('id');
          newComment.save();
          Ember.RSVP.all([newComment.save(), newPost.get("comments")]).then(function(promises) {
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

      it("contains a hasMany relationship", function(done) {
        newPost.get('comments').then(function(comments) {
          assert(comments.objectAt(0).get('body'), 'This is a new comment');
          done();
        });
      });

    });

    describe("multiple normalized relationships", function() {

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

        adapter._ref = firebaseTestRef.child("normalized");

        Ember.run(function() {
          newUser = store.createRecord("user");
          newComment = store.createRecord("comment", {
            body: "This is a new comment"
          });
          newPost1 = store.createRecord("post", {
            title: "Post 1"
          });
          newPost2 = store.createRecord("post", {
            title: "Post 2"
          });
          newPost3 = store.createRecord("post", {
            title: "Post 3"
          });
          newUser.get("posts").then(function(posts) {
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

      it("adds a comment without removing old posts", function(done) {
        Ember.run(function() {
          newUser.get("comments").then(function(comments) {
            var posts;
            comments.addObject(newComment);
            newUser.save().then(function() {
              return newComment.save();
            }).then(function() {
              return newUser.get('posts').then(function(ps) {
                posts = ps;
              });
            }).then(function() {
              assert(Ember.A(posts).contains(newPost1));
              assert(Ember.A(posts).contains(newPost2));
              assert(Ember.A(posts).contains(newPost3));
              done();
            });
          });
        });
      });

    });

    describe("embedded hasMany records", function() {

      var reference, newPost, newComment, currentData, postData, commentData;
      var postId, commentId;

      beforeEach(function(done) {
        app.Post = DS.Model.extend({
          title: DS.attr('string'),
          body: DS.attr('string'),
          published: DS.attr('number'),
          publishedDate: Ember.computed('published', function() {
            return moment(this.get('published')).format('MMMM Do, YYYY');
          }),
          user: DS.belongsTo('user', { async: true }),
          comments: DS.hasMany("comment", { embedded: true }) // force embedded
        });

        reference = firebaseTestRef.child("denormalized");
        adapter._ref = reference;
        Ember.run(function() {
          newComment = store.createRecord("comment", {
            body: "This is a new comment"
          });
          newPost = store.createRecord('post', {
            title: "New Post"
          });
          postId = newPost.get('id');
          commentId = newComment.get('id');
          newPost.get("comments").addObject(newComment);
          newPost.save().then(function() {
            reference.once('value', function(data) {
              currentData = data.val();
              postData = currentData.posts[postId];
              commentData = postData.comments[commentId];
              done();
            });
          });
        });
      });

      afterEach(function() {
        delete app.Post;
      });

      it("save to server correctly", function() {
        assert.equal(commentData.body, "This is a new comment");
      });

      it("maintain the correct .ref()", function() {
        var refPath = newComment.ref().path.toString();
        var expectedPath = `/blogs/tests/adapter/updaterecord/denormalized/posts/${postId}/comments/${commentId}`;
        assert.equal(refPath, expectedPath);
      });

      it("are not 'dirty'", function() {
        assert(!newComment.get('isDirty'), "The embedded record should not be 'dirty'");
      });

      it("are not 'new'", function() {
        assert(!newComment.get('isNew'), "The embedded record should not be 'new'");
      });

      it("are not 'saving'", function() {
        assert(!newComment.get('isSaving'), "The embedded record should be 'saving'");
      });

      it("become 'dirty' when editing", function() {
        newComment.set('body', 'new body');
        assert(newComment.get('isDirty'), "The embedded record should be 'dirty'");
      });

      it("are not 'dirty' after re-saving", function(done) {
        newComment.set('body', 'new body');
        newPost.save().then(function () {
          newComment.ref().once('value', function(snapshot) {
            commentData = snapshot.val();
            assert.equal(commentData.body, 'new body');
            assert(!newComment.get('isDirty'), 'record should not be dirty');
            done();
          });
        });
      });

      it("rollback to a clean state", function() {
        newComment.set('body', 'new body');
        assert(newComment.get('isDirty'), "The embedded record should be 'dirty'");
        newComment.rollback();
        assert(!newComment.get('isDirty'), "The embedded record should not be 'dirty'");
      });

      it("rollback to their last saved state", function() {
        newComment.set('body', 'new body');
        assert(newComment.get('isDirty'), "The embedded record should be 'dirty'");
        newComment.rollback();
        assert.equal(newComment.get('body'), 'This is a new comment');
      });

      describe('when invoking .save() directly', function () {

        it("update on the server at the correct location", function(done) {
          Ember.run(() => {
            newComment.set('body', 'Updated');
            newComment.save().then(() => {
              newComment.ref().once('value', function (snap) {
                assert.equal(snap.val().body, "Updated");
                done();
              });
            });
          });
        });

        it("do not duplicate data on the server", function(done) {
          Ember.run(() => {
            newComment.save().then(() => {
              reference.once('value', function (snap) {
                assert.equal(snap.val().comments, undefined);
                done();
              });
            });
          });
        });

      }); // when invoking .save() directly

    }); // embedded hasMany records

    describe("embedded belongsTo records", function() {

      var reference, newPost, newComment, currentData, postData, commentData;
      var postId, commentId;

      beforeEach(function(done) {
        app.Post = DS.Model.extend({
          title: DS.attr('string'),
          body: DS.attr('string'),
          published: DS.attr('number'),
          publishedDate: Ember.computed('published', function() {
            return moment(this.get('published')).format('MMMM Do, YYYY');
          }),
          user: DS.belongsTo('user', { async: true }),
          comment: DS.belongsTo("comment", { embedded: true }) // force embedded
        });

        reference = firebaseTestRef.child("denormalized");
        adapter._ref = reference;
        Ember.run(function() {
          newComment = store.createRecord("comment", {
            body: "This is a new comment"
          });
          newPost = store.createRecord('post', {
            title: "New Post"
          });
          postId = newPost.get('id');
          commentId = newComment.get('id');
          newPost.set("comment", newComment);
          newPost.save().then(function() {
            reference.once('value', function(data) {
              currentData = data.val();
              postData = currentData.posts[postId];
              commentData = postData.comment;
              done();
             });
          });
        });
      });

      afterEach(function() {
        delete app.Post;
      });

      it("save to server correctly", function() {
        assert.equal(commentData.body, "This is a new comment");
      });

      it("maintain the correct .ref()", function() {
        var refPath = newComment.ref().path.toString();
        var expectedPath = `/blogs/tests/adapter/updaterecord/denormalized/posts/${postId}/comment`;
        assert.equal(refPath, expectedPath);
      });

      it("save with an id", function() {
        assert(commentData.id, "The id should exist in the embedded payload");
      });

      it("are not 'dirty'", function() {
        assert(!newComment.get('isDirty'), "The embedded record should not be 'dirty'");
      });

      it("are not 'new'", function() {
        assert(!newComment.get('isNew'), "The embedded record should not be 'new'");
      });

      it("are not 'saving'", function() {
        assert(!newComment.get('isSaving'), "The embedded record should be 'saving'");
      });

      it("become 'dirty' when editing", function() {
        newComment.set('body', 'new body');
        assert(newComment.get('isDirty'), "The embedded record should be 'dirty'");
      });

      it("are not 'dirty' after re-saving", function(done) {
        newComment.set('body', 'new body');
        newPost.save().then(function () {
          newComment.ref().once('value', function(snapshot) {
            commentData = snapshot.val();
            assert.equal(commentData.body, 'new body');
            assert(!newComment.get('isDirty'), 'record should not be dirty');
            done();
          });
        });
      });

      it("rollback to a clean state", function() {
        newComment.set('body', 'new body');
        assert(newComment.get('isDirty'), "The embedded record should be 'dirty'");
        newComment.rollback();
        assert(!newComment.get('isDirty'), "The embedded record should not be 'dirty'");
      });

      it("rollback to their last saved state", function() {
        newComment.set('body', 'new body');
        assert(newComment.get('isDirty'), "The embedded record should be 'dirty'");
        newComment.rollback();
        assert.equal(newComment.get('body'), 'This is a new comment');
      });

      describe('when invoking .save() directly', function () {

        it("update on the server at the correct location", function(done) {
          Ember.run(() => {
            newComment.set('body', 'Updated');
            newComment.save().then(() => {
              newComment.ref().once('value', function (snap) {
                assert.equal(snap.val().body, "Updated");
                done();
              });
            });
          });
        });

        it("do not duplicate data on the server", function(done) {
          Ember.run(() => {
            newComment.save().then(() => {
              reference.once('value', function (snap) {
                assert.equal(snap.val().comments, undefined);
                done();
              });
            });
          });
        });

      }); // when invoking .save() directly

    }); // embedded belongsTo records

  });

});
