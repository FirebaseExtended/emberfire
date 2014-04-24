/*global describe, before, beforeEach, after, afterEach, specify, it, assert, App, FirebaseTestRef, TestHelpers */

describe("FirebaseAdapter", function() {

  var store, serializer, adapter;

  before(function() {
    App.ApplicationAdapter = DS.FirebaseAdapter.extend({
      firebase: FirebaseTestRef.child("blogs/normalized")
    });
    store = App.__container__.lookup("store:main");
    serializer = App.__container__.lookup("serializer:-firebase");
    adapter = App.__container__.lookup("adapter:application");
  });

  beforeEach(function() {
    App.reset();
  });

  describe("#init()", function() {

    it("has a Firebase ref", function() {
      assert(adapter._ref !== undefined);
      assert(adapter._ref.toString().match(/^https\:\/\/emberfire\-demo\.firebaseio\.com/g));
    });

  });

  describe("#_getRef()", function() {

    it("returns the correct Firebase ref for a type", function() {
      var ref = adapter._getRef(store.modelFor("post"));
      assert(ref.toString().match(/blogs\/normalized\/posts$/g));
    });

    it("returns the correct Firebase ref for a type and id", function() {
      var ref = adapter._getRef(store.modelFor("post"), "post_1");
      assert(ref.toString().match(/blogs\/normalized\/posts\/post_1$/g));
    });

  });

  describe("#_queueScheduleFlush()", function() {

    var spy;

    before(function() {
      spy = sinon.spy(adapter, "_queueScheduleFlush");
    });

    it("schedules a #_queueFlush()", function(done) {
      adapter._queueScheduleFlush();
      Ember.run.later(this, function() {
        assert.equal(spy.callCount, 1);
        done();
      }, adapter._queueFlushDelay * 2);
    });

    after(function() {
      spy.restore();
    });

  });

  describe("#_enqueue()", function() {

    var queueScheduleFlushSpy, queueFlushSpy, callbackSpy;

    before(function() {
      queueScheduleFlushSpy = sinon.spy(adapter, "_queueScheduleFlush");
      queueFlushSpy = sinon.spy(adapter, "_queueFlush");
      callbackSpy = sinon.spy();
    });

    it("pushes a new item into the _queue", function() {
      adapter._enqueue(callbackSpy, ['foo']);
      assert.equal(adapter._queue.length, 1);
    });

    it("schedules a _queueFlush()", function() {
      assert.equal(queueScheduleFlushSpy.callCount, 1);
    });

    it("flushes the _queue", function(done) {
      Ember.run.later(this, function() {
        assert.equal(queueFlushSpy.callCount, 1);
        done();
      }, adapter._queueFlushDelay * 2);
    });

    it("applys the callback with the correct arguments", function() {
      assert.equal(callbackSpy.callCount, 1);
      assert.equal(callbackSpy.getCall(0).args[0], 'foo');
    });

    after(function() {
      queueScheduleFlushSpy.restore();
      queueFlushSpy.restore();
    });

  });

  describe("#find()", function() {

    var getRefSpy, find, findRef;

    before(function() {
      getRefSpy = sinon.spy(adapter, "_getRef");
      find = adapter.find(store, store.modelFor("post"), "post_1");
      findRef = getRefSpy.getCall(0).returnValue;
    });

    it("creates a single Firebase reference", function() {
      assert(getRefSpy.calledOnce);
    });

    it("creates the correct Firebase reference", function() {
      assert(findRef.toString().match(/blogs\/normalized\/posts\/post_1$/g));
    });

    it("returns an object", function() {
      assert.equal(typeof find, "object");
    });

    it("returns a promise", function() {
      assert.equal(typeof find.then, "function");
    });

    it("resolves with the correct payload", function(done) {
      Ember.run(function() {
        find.then(function(payload) {
          assert.equal(payload.id, "post_1");
          done();
        });
      });
    });

    it("throws an error for records that don't exist", function(done) {
      Ember.run(function() {
        adapter.find(store, store.modelFor("post"), "foobar").then(function() {}, function(error) {
          assert(error instanceof Error);
          done();
        });
      });
    });

    after(function() {
      getRefSpy.restore();
    });

  });

  describe("#findAll()", function() {

    var getRefSpy, findAllAddEventListenersSpy, handleChildValueSpy;
    var findAll, findAllRef;
    var Post;

    before(function(done) {
      Post = TestHelpers.getModelName('Post');
      App[Post] = App.Post.extend({
        comments: DS.hasMany("comment", { async: true })
      });
      getRefSpy = sinon.spy(adapter, "_getRef");
      findAllAddEventListenersSpy = sinon.spy(adapter, "_findAllAddEventListeners");
      handleChildValueSpy = sinon.spy(adapter, "_handleChildValue");
      Ember.run(function() {
        findAll = adapter.findAll(store, store.modelFor("post"));
        findAllRef = getRefSpy.getCall(0).returnValue;
        done();
      });
    });

    it("creates a single Firebase reference", function() {
      assert(getRefSpy.calledOnce);
    });

    it("creates the correct Firebase reference", function() {
      assert(findAllRef.toString().match(/blogs\/normalized\/posts$/g));
    });

    it("returns an object", function() {
      assert.equal(typeof findAll, "object");
    });

    it("returns a promise", function() {
      assert.equal(typeof findAll.then, "function");
    });

    it("resolves with the correct payload", function(done) {
      Ember.run(function() {
        findAll.then(function(payload) {
          assert(Ember.isArray(payload));
          assert.equal(payload.length, 2);
          done();
        });
      });
    });

    /*it("adds the correct event listeners", function() {
      assert.equal(findAllRef._events.child_added.length, 1, "child_added event was added");
      assert.equal(findAllRef._events.child_removed.length, 1, "child_removed event was added");
      assert.equal(findAllRef._events.child_changed.length, 1, "child_changed event was added");
    });

    it("only adds event listeners once per type", function(done) {
      adapter.findAll(store, store.modelFor("post")).then(function() {
        assert.equal(findAllAddEventListenersSpy.callCount, 1);
        done();
      });
    });*/

    it("adds new child values to the store", function(done) {
        findAllRef.child('post_3').set({
          "published": 1395162147646,
          "body": "This is the third FireBlog post!",
          "title": "Post 3"
        });
        Ember.run.later(this, function() {
          assert(store.hasRecordForId('post', 'post_3'));
          done();
        }, adapter._queueFlushDelay * 2);
    });

    it("handles empty collections", function(done) {
      Ember.run(function() {
        adapter.findAll(store, store.modelFor(Post)).then(function(posts) {
          assert(Ember.isArray(posts));
          done();
        });
      });
    });

    after(function() {
      getRefSpy.restore();
      findAllAddEventListenersSpy.restore();
      handleChildValueSpy.restore();
    });

  });

  describe("#updateRecord()", function() {

    describe("normalized relationship", function() {

      var _ref, newPost, newComment;
      var updateRecordSpy, getSerializedRecordSpy, getRefSpy, getRelationshipRefSpy;
      var saveHasManyRelationshipSpy;
      var updateRef, relationshipRef, serializedRecord, finalPayload;

      before(function(done) {
        _ref = adapter._ref;
        adapter._ref = FirebaseTestRef.child("blogs/tests/adapter/updaterecord/normalized");
        updateRecordSpy = sinon.spy(adapter, "updateRecord");
        getSerializedRecordSpy = sinon.spy(adapter, "_getSerializedRecord");
        getRefSpy = sinon.spy(adapter, "_getRef");
        getRelationshipRefSpy = sinon.spy(adapter, "_getRelationshipRef");
        saveHasManyRelationshipSpy =sinon.spy(adapter, "_saveHasManyRelationship");
        Ember.run(function() {
          newComment = store.createRecord("comment", {
            body: "This is a new comment"
          });
          newPost = store.createRecord("post", {
            title: "New Post"
          });
          Ember.RSVP.Promise.cast(newPost.get("comments")).then(function(comments) {
            comments.addObject(newComment);
            newPost.save().then(function() {
              updateRef = getRefSpy.getCall(0).returnValue;
              relationshipRef = getRelationshipRefSpy.getCall(0).returnValue;
              serializedRecord = updateRecordSpy.getCall(0).args[2].serialize();
              finalPayload = getSerializedRecordSpy.getCall(0).returnValue;
              finalPayload.then(function(payload) {
                finalPayload = payload;
                done();
              });
            });
          });
        });
      });

      it("created the correct Firebase reference", function() {
        var re = new RegExp(Ember.String.fmt("blogs/tests/adapter/updaterecord/normalized/posts/%@$", [newPost.id]), 'g');
        assert(getRefSpy.calledOnce);
        assert(updateRef.toString().match(re));
      });

      it("contains a hasMany relationship", function() {
        assert(Ember.isArray(serializedRecord.comments));
        assert(Ember.A(serializedRecord.comments).contains(newComment.id));
      });

      it("removed the hasMany relationship from the final payload", function() {
        assert(Ember.isNone(finalPayload.comments));
      });

      it("created the correct relationship Firebase reference", function() {
        var re = new RegExp(Ember.String.fmt("blogs/tests/adapter/updaterecord/normalized/posts/%@/comments/%@$", [newPost.id, newComment.id]), 'g');
        assert(relationshipRef.toString().match(re));
      });

      it("saved each related record", function(done) {
        var promise = saveHasManyRelationshipSpy.getCall(0).returnValue;
        Ember.run(function() {
          promise.then(function(savedRecords) {
            var fulfilled = Ember.A(Ember.A(savedRecords).filterBy('state', 'fulfilled'));
            assert.equal(fulfilled.get('length'), 1);
            done();
          }, function() {});
        });
      });

      /*it("saved the related record by reference", function() {
        assert.equal(typeof relationshipRef.set.getCall(0).args[0], "boolean");
      });*/

      after(function(done) {
        updateRecordSpy.restore();
        getSerializedRecordSpy.restore();
        getRefSpy.restore();
        getRelationshipRefSpy.restore();
        saveHasManyRelationshipSpy.restore();
        Ember.run(function() {
          newComment.deleteRecord();
          newPost.deleteRecord();
          adapter._ref = _ref;
          done();
        });
      });

    });

    describe("multiple normalized relationships", function() {

      var _ref, newPost1, newPost2, newPost3, newComment, newUser;

      before(function(done) {
        _ref = adapter._ref;
        adapter._ref = FirebaseTestRef.child("blogs/tests/adapter/updaterecord/normalized");
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
            posts.addObjects([newPost1, newPost2, newPost3]);
            newUser.save().then(function() {
              newPost1.save();
              newPost2.save();
              newPost3.save();
            }).then(function(){
              done();
            });
          });
        });
      });

      it("adds a comment without removing old posts", function(done) {
        Ember.run(function() {
          newUser.get("comments").then(function(comments) {
            var posts;
            comments.addObject(newComment);
            newUser.save().then(function() {
              newComment.save();
            }).then(function() {
              newUser.get('posts').then(function(ps) {
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

      after(function(done) {
        Ember.run(function() {
          newUser.deleteRecord();
          newPost1.deleteRecord();
          newPost2.deleteRecord();
          newPost3.deleteRecord();
          adapter._ref = _ref;
          done();
        });
      });

    });

    describe("denormalized relationship", function() {

      var _ref, Post, newPost, newComment;
      var getRefSpy, getRelationshipRefSpy, getSerializedRecordSpy, updateRecordSpy;
      var saveHasManyRelationshipSpy;
      var updateRef, relationshipRef, serializedRecord, finalPayload;

      before(function(done) {
        _ref = adapter._ref;
        Post = TestHelpers.getModelName('Post');
        App[Post] = App.Post.extend({
          comments: DS.hasMany("comment", { embedded: true })
        });
        adapter._ref = FirebaseTestRef.child("blogs/tests/adapter/updaterecord/denormalized");
        updateRecordSpy = sinon.spy(adapter, "updateRecord");
        getSerializedRecordSpy = sinon.spy(adapter, "_getSerializedRecord");
        getRefSpy = sinon.spy(adapter, "_getRef");
        getRelationshipRefSpy = sinon.spy(adapter, "_getRelationshipRef");
        saveHasManyRelationshipSpy =sinon.spy(adapter, "_saveHasManyRelationship");
        Ember.run(function() {
          newComment = store.createRecord("comment", {
            body: "This is a new comment"
          });
          newPost = store.createRecord(Post, {
            title: "New Post"
          });
          newPost.get("comments").addObject(newComment);
          newPost.save().then(function() {
            updateRef = getRefSpy.getCall(0).returnValue;
            relationshipRef = getRelationshipRefSpy.getCall(0).returnValue;
            serializedRecord = updateRecordSpy.getCall(0).args[2].serialize();
            finalPayload = getSerializedRecordSpy.getCall(0).returnValue;
            finalPayload.then(function(payload) {
              finalPayload = payload;
              done();
            });
          });
        });
      });

      it("created the correct Firebase reference", function() {
        var re = new RegExp(Ember.String.fmt("blogs/tests/adapter/updaterecord/denormalized/%@s/%@$", [Post.toLowerCase(), newPost.id]), 'g');
        assert(getRefSpy.calledOnce);
        assert(updateRef.toString().match(re));
      });

      it("contains a hasMany relationship", function() {
        assert(Ember.isArray(serializedRecord.comments));
        assert(Ember.A(serializedRecord.comments).contains(newComment.id));
      });

      it("removed the hasMany relationship from the final payload", function() {
        assert(Ember.isNone(finalPayload.comments));
      });

      it("created the correct relationship Firebase reference", function() {
        var re = new RegExp(Ember.String.fmt("blogs/tests/adapter/updaterecord/denormalized/%@s/%@/comments/%@$", [Post.toLowerCase(), newPost.id, newComment.id]), 'g');
        assert(relationshipRef.toString().match(re));
      });

      it("saved each related record", function(done) {
        var promise = saveHasManyRelationshipSpy.getCall(0).returnValue;
        Ember.run(function() {
          promise.then(function(savedRecords) {
            var fulfilled = Ember.A(Ember.A(savedRecords).filterBy('state', 'fulfilled'));
            assert.equal(fulfilled.get('length'), 1);
            done();
          }, function() {});
        });
      });

      it("saved the related record by serialization", function() {
        assert.equal(typeof relationshipRef.update.getCall(0).args[0], "object");
      });

      after(function(done) {
        updateRecordSpy.restore();
        getSerializedRecordSpy.restore();
        getRefSpy.restore();
        getRelationshipRefSpy.restore();
        saveHasManyRelationshipSpy.restore();
        Ember.run(function() {
          newComment.deleteRecord();
          newPost.deleteRecord();
          adapter._ref = _ref;
          done();
        });
      });

    });

  });

});
