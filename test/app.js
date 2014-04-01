(function (window) {

  var App, FirebaseTestRef;

  var map = Ember.EnumerableUtils.map;
  var forEach = Ember.EnumerableUtils.forEach;
  var fmt = Ember.String.fmt;

  ////////////////////////////////////////////////////////////
  // App
  ////////////////////////////////////////////////////////////

  App = window.App = Ember.Application.create();

  App.rootElement = '#mocha';
  App.setupForTesting();
  App.injectTestHelpers();

  ////////////////////////////////////////////////////////////
  // EmberData
  ////////////////////////////////////////////////////////////

  var FIREBASE_FIXTURE_DATA = {
    "blogs": {
      "denormalized": {
        "users": {
          "aputinski": {
            "created": 1395162147634
          }
        },
        "posts": {
          "post_1": {
            "published": 1395162147646,
            "user": "aputinski",
            "body": "This is the first FireBlog post!",
            "comments": {
              "comment_1": true,
              "comment_2": true
            },
            "title": "Post 1"
          },
          "post_2": {
            "published": 1395162147646,
            "user": "aputinski",
            "body": "This is the second FireBlog post!",
            "comments": {
              "comment_3": true,
              "comment_4": true
            },
            "title": "Post 2"
          }
        },
        "comments": {
          "comment_1": {
            "published": 1395176007623,
            "user": "aputinski",
            "body": "This is a comment"
          },
          "comment_2": {
            "published": 1395176007624,
            "user": "aputinski",
            "body": "This is a second comment"
          },
          "comment_3": {
            "published": 1395176007625,
            "user": "aputinski",
            "body": "This is a third comment"
          },
          "comment_4": {
            "published": 1395176007626,
            "user": "aputinski",
            "body": "This is a fourth comment"
          }
        }
      },
      "embedded": {
        "posts": {
          "post_1": {
            "published": 1395162147646,
            "user": "aputinski",
            "body": "This is the first FireBlog post!",
            "comments": {
              "comment_1": {
                "published": 1395176007623,
                "user": "aputinski",
                "body": "This is a comment"
              },
              "comment_2": {
                "published": 1395176007624,
                "user": "aputinski",
                "body": "This is a second comment"
              }
            },
            "title": "Post 1"
          },
          "post_2": {
            "published": 1395162147646,
            "user": "aputinski",
            "body": "This is the second FireBlog post!",
            "comments": {
              "comment_3": {
                "published": 1395176007625,
                "user": "aputinski",
                "body": "This is a third comment"
              },
              "comment_4": {
                "published": 1395176007626,
                "user": "aputinski",
                "body": "This is a fourth comment"
              }
            },
            "title": "Post 2"
          }
        }
      },
      "invalid": {
        "posts": {
          "post_1": {
            "published": 1395162147646,
            "user": "aputinski",
            "body": "This is the first FireBlog post!",
            "comments": ["comment_1", "comment_2"],
            "title": "Post 1"
          },
          "post_2": {
            "published": 1395162147646,
            "user": "aputinski",
            "body": "This is the second FireBlog post!",
            "comments": ["comment_3", "comment_4"],
            "title": "Post 2"
          }
        }
      }
    }
  };

  FirebaseTestRef = window.FirebaseTestRef = new MockFirebase('Mock://', FIREBASE_FIXTURE_DATA).autoFlush(100);

  App.ApplicationAdapter = DS.FirebaseAdapter.extend({
    firebase: FirebaseTestRef
  });

  App.Post = DS.Model.extend({
    title: DS.attr('string'),
    body: DS.attr('string'),
    published: DS.attr('number'),
    publishedDate: Ember.computed('published', function() {
      return this.get('published');
    }),
    user: DS.belongsTo('user', { async: true }),
    comments: DS.hasMany('comment', { async: true })
  });

  App.Comment = DS.Model.extend({
    body: DS.attr('string'),
    published: DS.attr('number'),
    publishedDate: Ember.computed('published', function() {
      return this.get('published');
    }),
    user: DS.belongsTo('user', { async: true })
  });

  App.User = DS.Model.extend({
    created: DS.attr('number'),
    username: Ember.computed('id', function() {
      return this.get('id');
    }),
    avatar: Ember.computed(function() {
      return 'https://www.gravatar.com/avatar/' + md5(this.get('id')) + '.jpg?d=retro&size=80';
    }),
    posts: DS.hasMany('post', { async: true })
  });

})(window);