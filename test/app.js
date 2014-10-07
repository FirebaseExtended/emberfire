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
  Ember.Test.adapter = Ember.Test.Adapter.create();

  App.setupForTesting();
  App.injectTestHelpers();

  ////////////////////////////////////////////////////////////
  // EmberData
  ////////////////////////////////////////////////////////////

  var FIREBASE_FIXTURE_DATA = {
    "blogs": {
      "normalized": {
        "users": {
          "aputinski": {
            "firstName": "Adam",
            "created": 1395162147634,
            "posts": {
              "post_1": true,
              "post_2": true
            }
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
      "denormalized": {
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
      "double_denormalized": {
        "posts": {
          "post_1": {
            "published": 1395162147646,
            "user": "aputinski",
            "body": "This is the first FireBlog post!",
            "embeddedComments": {
              "comment_1": {
                "published": "32",
                "embeddedUser": {
                  "id": "aputinski",
                  "firstName": "Adam"
                },
                "body": "This is a comment"
              },
            },
            "title": "Post 1"
          },
        },
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

  FirebaseTestRef = window.FirebaseTestRef = new Firebase('https://emberfire-demo.firebaseio.com');
  Firebase.goOffline();
  FirebaseTestRef.on('value', function() {});
  FirebaseTestRef.off('value', function() {});

  var FirebaseSet = Firebase.prototype.set;
  var FirebaseUpdate = Firebase.prototype.update;

  sinon.stub(Firebase.prototype, 'set', function(data, afterSet) {
    FirebaseSet.call(this, data, afterSet);
    if (typeof afterSet === 'function') {
      afterSet();
    }
  });

  sinon.stub(Firebase.prototype, 'update', function(data, afterUpdate) {
    FirebaseUpdate.call(this, data, afterUpdate);
    if (typeof afterUpdate === 'function') {
      afterUpdate();
    }
  });

  FirebaseTestRef.set(FIREBASE_FIXTURE_DATA);

  App.ApplicationAdapter = DS.FirebaseAdapter.extend({
    firebase: FirebaseTestRef.child('blogs/normalized'),
    _queueFlushDelay: false
  });

  App.Post = DS.Model.extend({
    title: DS.attr('string'),
    body: DS.attr('string'),
    published: DS.attr('number'),
    publishedDate: Ember.computed('published', function() {
      return this.get('published');
    }),
    user: DS.belongsTo('user', { async: true }),
    comments: DS.hasMany('comment', { async: true }),
    embeddedComments: DS.hasMany('comment', { embedded: true })
  });

  App.Comment = DS.Model.extend({
    body: DS.attr('string'),
    published: DS.attr('number'),
    publishedDate: Ember.computed('published', function() {
      return this.get('published');
    }),
    user: DS.belongsTo('user', { async: true }),
    embeddedUser: DS.belongsTo('user', { embedded: true, inverse:null })
  });

  App.User = DS.Model.extend({
    created: DS.attr('number'),
    username: Ember.computed('id', function() {
      return this.get('id');
    }),
    firstName: DS.attr('string'),
    avatar: Ember.computed(function() {
      return 'https://www.gravatar.com/avatar/' + md5(this.get('id')) + '.jpg?d=retro&size=80';
    }),
    posts: DS.hasMany('post', { async: true }),
    comments: DS.hasMany('comment', { async: true, inverse:'user' })
  });

  /*App.Router.map(function() {
    this.route('index', { path: '/' });
  });

  App.IndexRoute = Ember.Route.extend({
    model: function() {
      return this.store.find('post');
    },
    setupController: function(controller, model) {
      console.log(model);
    }
  });*/

})(window);
