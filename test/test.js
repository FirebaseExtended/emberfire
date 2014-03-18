/*jshint -W117 */

var store, adapter, serializer;

var postsPayload = [{
  title: "Hello World",
  comments: {
    "comment_1": true,
    "comment_2": true
  }
},{
  title: "Hello World",
  comments: {
    "comment_1": true,
    "comment_2": true
  }
}];

module("FirebaseSerializer", {
  setup: function() {
    App.reset();
    store = App.__container__.lookup('store:main');
    serializer = App.__container__.lookup('serializer:application');
  }
});

  test("#normalize()", function() {

    ok(typeof DS.FirebaseSerializer !== 'undefined');

    test("Valid payload", function() {
      var postPayload = {
        title: "Hello World",
        comments: {
          "comment_1": true,
          "comment_2": true
        }
      };
      var normalizedPayload = serializer.normalize(store.modelFor('post'), postPayload);

      ok(Ember.isArray(normalizedPayload.comments), "it converts hasMany relationships to arrays");
    });

    test("Invalid payload", function() {
      var postPayload = {
        title: "Hello World",
        comments: ["comment_1", "comment_2"]
      };

      throws(function() {
        var normalizedPayload = serializer.normalize(store.modelFor('post'), postPayload);
      }, "it throws an error for hasMany relationships that come down as an array");
    });

  });

  test("#extractSingle()", function() {

    var postsPayload = [{
      title: "Hello World",
      comments: {
        "comment_1": true,
        "comment_2": true
      }
    },{
      title: "Hello World",
      comments: {
        "comment_1": true,
        "comment_2": true
      }
    }];

    var spy = sinon.spy(serializer, 'extractSingle');
    var extractedArray = serializer.extractArray(store, store.modelFor('post'), postsPayload);

    equal(spy.callCount, 2, "it was called for each item in the payload");

    spy.restore();

  });

  test("#extractArray()", function() {

    var postsPayload = [{
      title: "Hello World",
      comments: {
        "comment_1": true,
        "comment_2": true
      }
    },{
      title: "Hello World",
      comments: {
        "comment_1": true,
        "comment_2": true
      }
    }];

    var spy = sinon.spy(serializer, 'extractArray');
    var extractedArray = serializer.extractArray(store, store.modelFor('post'), postsPayload);

    ok(Ember.isArray(extractedArray), "it returns an array");
    equal(spy.callCount, 1, "it was called once");
    equal(extractedArray.length, 2, "the returned array contains the correct amount of items");

    spy.restore();

  });

/*test("root lists first page of posts", function() {
  visit("/posts");
  andThen(function() {
    equal(find(".post-slug").length, 2, "The first page should have 1 post");
  });
});*/