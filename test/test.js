/*jshint -W117 */

var store, serializer, adapter;

var getPosts = function(snapshot) {
  var posts = [];
  snapshot.forEach(function(post) {
    posts.push(post.val());
  });
  return posts;
};

module("FirebaseSerializer", {
  setup: function() {
    App.reset();
    store = App.__container__.lookup('store:main');
    serializer = App.__container__.lookup('serializer:application');
    adapter = App.__container__.lookup('adapter:application');
  }
});

  asyncTest("#normalize() - Denormalized payload", function() {
    expect(2);
    App.Post = App.Post_.extend({
      comments: DS.hasMany('comment', { async: true })
    });
    FirebaseTestRef
      .child('blogs/denormalized/posts')
      .on('value', function(snapshot) {
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
      comments: DS.hasMany('comment', { embedded: true })
    });
    FirebaseTestRef
      .child('blogs/embedded/posts')
      .on('value', function(snapshot) {
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
      comments: DS.hasMany('comment', { async: true })
    });
    FirebaseTestRef
      .child('blogs/invalid/posts')
      .on('value', function(snapshot) {
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
      comments: DS.hasMany('comment', { async: true })
    });
    FirebaseTestRef
      .child('blogs/denormalized/posts')
      .on('value', function(snapshot) {
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
      comments: DS.hasMany('comment', { embedded: true })
    });
    FirebaseTestRef
      .child('blogs/embedded/posts')
      .on('value', function(snapshot) {
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
      comments: DS.hasMany('comment', { async: true })
    });
    FirebaseTestRef
      .child('blogs/denormalized/posts')
      .on('value', function(snapshot) {
        var posts = getPosts(snapshot);
        var spy = sinon.spy(serializer, "extractArray");
        var extractedArray;
        Ember.run(function() {
          extractedArray = serializer.extractArray(store, store.modelFor("post"), posts);
        });
        // TESTS
        ok(Ember.isArray(extractedArray), "it returns an array");
        equal(spy.callCount, 1, "it was called once");
        equal(extractedArray.length, 2, "the returned array contains the correct amount of items");
        // START
        start();
        spy.restore();
      });
  });

module("FirebaseAdapter", {
  setup: function() {
    App.reset();
    store = App.__container__.lookup('store:main');
    serializer = App.__container__.lookup('serializer:application');
    adapter = App.__container__.lookup('adapter:application');
  }
});

  test("#init()", function() {
    var ref = adapter._ref;
    // TEST
    ok(ref !== undefined, "The adapter has a Firebase ref");
    strictEqual(ref.toString(), "Mock://", "The adaper's Firebase ref is set to the correct path");
  });

  asyncTest("#find()", function() {
    expect(3);
    adapter._ref = adapter._ref.child("blogs/denormalized");
    var find = adapter.find(store, store.modelFor("post"), "post_1");
    // TEST
    strictEqual(typeof find, "object", "find() returned an an object");
    strictEqual(typeof find.then, "function", "find() returned a promise");
    find.then(function(payload) {
      console.log(payload);
      strictEqual(payload.id, "post_1", "The correct payload was returned");
      // START
      start();
    });
  });
