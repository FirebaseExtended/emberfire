/*jshint -W117 */

QUnit.config.reorder = false;

var store, serializer, adapter;

///////////////////////////////////////////////////////////////////////
// Utility
///////////////////////////////////////////////////////////////////////

var getPosts = function(snapshot) {
  var posts = [];
  snapshot.forEach(function(post) {
    posts.push(post.val());
  });
  return posts;
};

///////////////////////////////////////////////////////////////////////
// DS.FirebaseSerializer
///////////////////////////////////////////////////////////////////////

module("FirebaseSerializer", {
  setup: function() {
    App.reset();
    store = App.__container__.lookup("store:main");
    serializer = App.__container__.lookup("serializer:application");
    adapter = App.__container__.lookup("adapter:application");
  }
});

  asyncTest("#normalize() - Denormalized payload", function() {
    expect(2);
    App.Post = App.Post_.extend({
      comments: DS.hasMany("comment", { async: true })
    });
    FirebaseTestRef
      .child("blogs/denormalized/posts")
      .on("value", function(snapshot) {
        var posts = getPosts(snapshot);
        var normalizedPayload = serializer.normalize(store.modelFor("post"), posts[0]);
        var comments = normalizedPayload.comments;
        // TESTS
        ok(Ember.isArray(comments), "it converts hasMany relationships to arrays");
        ok(comments.contains("comment_1") && comments.contains("comment_2"), "the array contains the keys of the object");
        // START
        start();
      });
  });

  asyncTest("#normalize() - Embedded payload", function() {
    expect(1);
    App.Post = App.Post_.extend({
      comments: DS.hasMany("comment", { embedded: true })
    });
    FirebaseTestRef
      .child("blogs/embedded/posts")
      .on("value", function(snapshot) {
        var posts = getPosts(snapshot);
        var normalizedPayload = serializer.normalize(store.modelFor("post"), posts[0]);
        var comments = normalizedPayload.comments;
        // TESTS
        ok(!Ember.isArray(comments), "it leaves embedded hasMany relationships as objects");
        // START
        start();
      });
  });

  asyncTest("#normalize() - Invalid payload", function() {
    expect(1);
    App.Post = App.Post_.extend({
      comments: DS.hasMany("comment", { async: true })
    });
    FirebaseTestRef
      .child("blogs/invalid/posts")
      .on("value", function(snapshot) {
        var posts = getPosts(snapshot);
        // TESTS
        throws(function() {
          var normalizedPayload = serializer.normalize(store.modelFor("post"), posts[0]);
        }, "it throws an error for hasMany relationships that come down as an array");
        // START
        start();
      });
  });

  asyncTest("#extractSingle() - Denormalized payload", function() {
    expect(1);
    App.Post = App.Post_.extend({
      comments: DS.hasMany("comment", { async: true })
    });
    FirebaseTestRef
      .child("blogs/denormalized/posts")
      .on("value", function(snapshot) {
        var posts = getPosts(snapshot);
        var spy = sinon.spy(serializer, "extractSingle");
        var extractedArray = serializer.extractArray(store, store.modelFor("post"), posts);
        // TESTS
        equal(spy.callCount, 2, "it was called for each item in the payload");
        // START
        start();
        spy.restore();
      });
  });

  asyncTest("#extractSingle() - Embedded payload", function() {
    expect(2);
    App.Post = App.Post_.extend({
      comments: DS.hasMany("comment", { embedded: true })
    });
    FirebaseTestRef
      .child("blogs/embedded/posts")
      .on("value", function(snapshot) {
        var posts = getPosts(snapshot);
        var spy = sinon.spy(serializer, "extractSingle");
        var extractedArray;
        Ember.run(function() {
          extractedArray = serializer.extractArray(store, store.modelFor("post"), posts);
        });
        // TESTS
        var hasComments = function(ids) {
          return ids.every(function(id) {
            return store.hasRecordForId(store.modelFor("comment"), id);
          });
        };
        equal(spy.callCount, 2, "it was called for each item in the payload");
        ok(hasComments(["comment_1"]), "it pushed the embedded records into the store");
        // START
        start();
        spy.restore();
      });
  });

  asyncTest("#extractArray() - Denormalized payload", function() {
    expect(3);
    App.Post = App.Post_.extend({
      comments: DS.hasMany("comment", { async: true })
    });
    FirebaseTestRef
      .child("blogs/denormalized/posts")
      .on("value", function(snapshot) {
        var posts = getPosts(snapshot);
        var spy = sinon.spy(serializer, "extractArray");
        var extractedArray;
        Ember.run(function() {
          extractedArray = serializer.extractArray(store, store.modelFor("post"), posts);
        });
        // TESTS
        equal(spy.callCount, 1, "it was called once");
        ok(Ember.isArray(extractedArray), "it returns an array");
        equal(extractedArray.length, 2, "the returned array contains the correct number of items");
        // START
        start();
        spy.restore();
      });
  });

///////////////////////////////////////////////////////////////////////
// DS.FirebaseAdapter
///////////////////////////////////////////////////////////////////////

module("FirebaseAdapter", {
  setup: function() {
    App.reset();

    App.ApplicationAdapter = DS.FirebaseAdapter.extend({
      firebase: FirebaseTestRef.child("blogs/denormalized")
    });

    store = App.__container__.lookup("store:main");
    serializer = App.__container__.lookup("serializer:application");
    adapter = App.__container__.lookup("adapter:application");
  }
});

  asyncTest("#init()", function() {
    expect(2);
    var ref = adapter._ref;
    // TEST
    ok(ref !== undefined, "The adapter has a Firebase ref");
    strictEqual(ref.toString(), "Mock://blogs/denormalized", "The adaper's Firebase ref is set to the correct path");
    start();
  });

  asyncTest("#getRef()", function() {
    expect(2);
    var findRef = adapter._getRef(store.modelFor("post"), "post_1");
    var findAllRef = adapter._getRef(store.modelFor("post"));
    // TEST
    strictEqual(findRef.toString(), "Mock://blogs/denormalized/posts/post_1", "it returns the correct Firebase ref for a type and id");
    strictEqual(findAllRef.toString(), "Mock://blogs/denormalized/posts", "it returns the correct Firebase ref for a type");
    // START
    start();
  });

  asyncTest("#find()", function() {
    expect(5);
    var refSpy = sinon.spy(adapter, "_getRef");
    var find = adapter.find(store, store.modelFor("post"), "post_1");
    var refCall = refSpy.getCall(0);
    var findRef = refCall.returnValue;
    // TEST
    ok(refSpy.calledOnce, "it created a single Firebase ref");
    strictEqual(findRef.toString(), "Mock://blogs/denormalized/posts/post_1", "it created the correct ref was created");
    strictEqual(typeof find, "object", "it returned a object");
    strictEqual(typeof find.then, "function", "it returned a promise");
    find.then(function(payload) {
      strictEqual(payload.id, "post_1", "it resolved the correct payload");
      // START
      start();
      refSpy.restore();
    });
  });

  asyncTest("#findAll()", function() {
    expect(14);
    var refSpy = sinon.spy(adapter, "_getRef");
    var handleChildValueSpy = sinon.spy(adapter, "_handleChildValue");
    var findAll = adapter.findAll(store, store.modelFor("post"));
    var refCall = refSpy.getCall(0);
    var findAllRef = refCall.returnValue;
    // TEST
    ok(refSpy.calledOnce, "it creates a single Firebase ref");
    strictEqual(findAllRef.toString(), "Mock://blogs/denormalized/posts", "it created the correct ref was created");
    strictEqual(findAllRef._events.child_added.length, 1, "child_added event was added");
    strictEqual(findAllRef._events.child_removed.length, 1, "child_removed event was added");
    strictEqual(findAllRef._events.child_changed.length, 1, "child_changed event was added");
    strictEqual(typeof findAll, "object", "it returned a object");
    strictEqual(typeof findAll.then, "function", "it returned returned a promise");
    findAll.then(function(payload) {
      ok(Ember.isArray(payload), "it resolved with an array");
      strictEqual(payload.get("length"), 2, "the payload contains the correct number of items");
    });
    adapter.findAll(store, store.modelFor("post")).then(function(payload) {
      ok(Ember.isArray(payload), "it made resolved with an array");
      strictEqual(findAllRef._events.child_added.length, 1, "additional events were NOT added");
      strictEqual(findAllRef._events.child_removed.length, 1, "additional events were NOT added");
      strictEqual(findAllRef._events.child_changed.length, 1, "additional events were NOT added");
      // Add a new post
      findAllRef.flushDelay = false;
      findAllRef.child("post_3").set({
        "published": 1395162147646,
        "user": "aputinski",
        "body": "This is the first FireBlog post!",
        "title": "Post 3"
      });
      findAllRef.flush();
      findAllRef.flushDelay = 200;
      strictEqual(handleChildValueSpy.callCount, 1, "it added a new child to he store");
      // START
      start();
      refSpy.restore();
      handleChildValueSpy.restore();
    });
  });

  asyncTest("#updateRecord()", function() {
    expect(8);
    App.Post = App.Post_.extend({
      comments: DS.hasMany("comment", { async: true })
    });
    var newPost, newComment;
    var refSpy = sinon.spy(adapter, "_getRef");
    var relationshiptRefSpy = sinon.spy(adapter, "_getRelationshiptRef");
    var updateRecordSpy = sinon.spy(adapter, "updateRecord");
    Ember.run(function() {
      newComment = store.createRecord("comment", {
        body: "This is a new comment"
      });
      newPost = store.createRecord("post", {
        title: "New Post"
      });
      newPost.get("comments").then(function(comments) {
        comments.addObject(newComment);
      }).then(function() {
        FirebaseTestRef.flushDelay = false;
        newPost.save().then(function() {
          var refCall = refSpy.getCall(0);
          var ref = refCall.returnValue;
          var relationshiptRefCall = relationshiptRefSpy.getCall(0);
          var relationshipRef = relationshiptRefCall.returnValue;
          var serializedRecord = updateRecordSpy.getCall(0).args[2].serialize();
          var finalPayload = ref.update.getCall(0).args[0];
          // TEST
          ok(refSpy.calledOnce, "it creates a single Firebase ref");
          strictEqual(ref.toString(), "Mock://blogs/denormalized/posts/" + newPost.id, "the correct Firebase ref was created");
          ok(Ember.isArray(serializedRecord.comments), "the record contains a hasMany relationship");
          ok(serializedRecord.comments.contains(newComment.id), "the hasMany relationship contains the correct id");
          ok(Ember.isNone(finalPayload.comments), "the hasMany relationship was removed from the final payload");
          strictEqual(relationshipRef.toString(), "Mock://blogs/denormalized/posts/" + newPost.id + "/comments/" + newComment.id, "the correct related record Firebase ref was created");
          strictEqual(relationshipRef.update.callCount, 1, "it called ref.update() on each related record");
          strictEqual(typeof relationshipRef.update.getCall(0).args[0], "boolean", "the related record was saved by reference id");
          // START
          start();
          refSpy.restore();
          updateRecordSpy.restore();
          FirebaseTestRef.flushDelay = 200;
        });
      });
    });
  });

  asyncTest("#updateRecord() - Embedded records", function() {
    expect(8);
    App.Post = App.Post_.extend({
      comments: DS.hasMany("comment", { embedded: true })
    });
    var newPost, newComment;
    var refSpy = sinon.spy(adapter, "_getRef");
    var relationshiptRefSpy = sinon.spy(adapter, "_getRelationshiptRef");
    var updateRecordSpy = sinon.spy(adapter, "updateRecord");
    Ember.run(function() {
      newComment = store.createRecord("comment", {
        body: "This is another new comment"
      });
      newPost = store.createRecord("post", {
        title: "New Post times two"
      });
      newPost.get("comments").addObject(newComment);
      FirebaseTestRef.flushDelay = false;
      newPost.save().then(function() {
        var refCall = refSpy.getCall(0);
        var ref = refCall.returnValue;
        var relationshiptRefCall = relationshiptRefSpy.getCall(0);
        var relationshipRef = relationshiptRefCall.returnValue;
        var serializedRecord = updateRecordSpy.getCall(0).args[2].serialize();
        var finalPayload = ref.update.getCall(0).args[0];
        // TEST
        ok(refSpy.calledOnce, "it creates a single Firebase ref");
        strictEqual(ref.toString(), "Mock://blogs/denormalized/posts/" + newPost.id, "the correct Firebase ref was created");
        ok(Ember.isArray(serializedRecord.comments), "the record contains a hasMany relationship");
        ok(serializedRecord.comments.contains(newComment.id), "the hasMany relationship contains the correct id");
        ok(Ember.isNone(finalPayload.comments), "the hasMany relationship was removed from the final payload");
        strictEqual(relationshipRef.toString(), "Mock://blogs/denormalized/posts/" + newPost.id + "/comments/" + newComment.id, "the correct related record Firebase ref was created");
        strictEqual(relationshipRef.update.callCount, 1, "it called ref.update() on each related record");
        strictEqual(typeof relationshipRef.update.getCall(0).args[0], "object", "the related record was saved by serialization");
        // START
        start();
        refSpy.restore();
        updateRecordSpy.restore();
        FirebaseTestRef.flushDelay = 200;
      });
    });
  });