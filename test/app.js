(function (window) {

  var App, FirebaseTestRef;

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
    publishedDate: function() {
      return this.get('published');
    }.property('published'),
    user: DS.belongsTo('user', { async: true }),
    comments: DS.hasMany('comment', { async: true })
  });

  App.Comment = DS.Model.extend({
    body: DS.attr('string'),
    published: DS.attr('number'),
    publishedDate: function() {
      return this.get('published');
    }.property('published'),
    user: DS.belongsTo('user', { async: true })
  });

  App.User = DS.Model.extend({
    created: DS.attr('number'),
    username: function() {
      return this.get('id');
    }.property(),
    avatar: function() {
      return 'https://www.gravatar.com/avatar/' + md5(this.get('id')) + '.jpg?d=retro&size=80';
    }.property(),
    posts: DS.hasMany('post', { async: true })
  });

  App.RawTransform = DS.Transform.extend({
    deserialize: function(serialized) {
      return serialized;
    },
    serialize: function(deserialized) {
      return deserialized;
    }
  });

  ////////////////////////////////////////////////////////////
  // Routes
  ////////////////////////////////////////////////////////////

  /*App.Router.map(function() {
    this.resource('posts', { path: '/posts' }, function() {
      this.route('new');
    });
    this.resource('post', { path: '/post/:post_id' });
    this.resource('users', { path: '/users' });
    this.resource('user', { path: '/user/:user_id' });
  });

    /////////////////////////////////////////////
    // Index
    /////////////////////////////////////////////

    App.IndexRoute = Ember.Route.extend({
      redirect: function() {
        this.transitionTo('posts');
      }
    });

    /////////////////////////////////////////////
    // Posts
    /////////////////////////////////////////////

    App.PostsIndexRoute = Ember.Route.extend({
      model: function() {
        return this.store.findAll('post');
      }
    });

    App.PostsIndexController = Ember.ArrayController.extend({
      sortProperties: ['id'],
      sortAscending: false
    });

    App.PostsNewController = Ember.ObjectController.extend({
      init: function() {
        this.set('post',  Ember.Object.create());
      },
      postIsValid: function() {
        var isValid = true;
        ['post.title', 'post.username', 'post.body'].forEach(function(field) {
          if (this.get(field) === '') {
            isValid = false;
          }
        }, this);
        return isValid;
      },
      actions: {
        publishPost: function() {
          if (!this.postIsValid()) { return; }
          Ember.RSVP.hash({
            user: this.get('util').getUserByUsername(this.get('post.username'))
          })
          .then(function(promises) {
            var newPost = this.store.createRecord('post', {
              title: this.get('post.title'),
              body: this.get('post.body'),
              published: new Date().getTime(),
              user: promises.user
            });
            newPost.save();
            this.setProperties({
              'post.title': '',
              'post.username': '',
              'post.body': ''
            });
            this.transitionToRoute('post', newPost);
          }.bind(this));
        }
      },
      post: undefined
    });

    /////////////////////////////////////////////
    // Post
    /////////////////////////////////////////////

    App.PostRoute = Ember.Route.extend({
      model: function(params) {
        return this.store.find('post', params.post_id);
      }
    });

    App.PostController = Ember.ObjectController.extend({
      actions: {
        publishComment: function(post, comment) {
          // Save the comment
          comment.save();
          // Add the new comment to the post and save it
          post.get('comments').addObject(comment);
          // Save the post
          post.save().then(function() {
            // Success
          }, function(error) {
            //console.log(error);
          });
        }
      }
    });

    ///////////////////////////////////////////////
    // Users
    ///////////////////////////////////////////////

    App.UsersRoute = Ember.Route.extend({
      model: function() {
        return this.store.findAll('user');
      }
    });

    App.UsersController = Ember.ArrayController.extend({
      sortProperties: ['firstName'],
      sortAscending: true
    });

    /////////////////////////////////////////////
    // User
    /////////////////////////////////////////////

    App.UserRoute = Ember.Route.extend({
      model: function(params) {
        return this.store.find('user', params.user_id);
      }
    });

    App.UserController = Ember.ObjectController.extend();

  ////////////////////////////////////////////////////////////
  // Components
  ////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////
    // Post
    ///////////////////////////////////////////////

    App.FirePostComponent = Ember.Component.extend({
      classNames: ['post'],
      classNameBindings: ['isExpanded:post-expanded', 'isSingle:post-single'],
      commentUsername: '',
      commentBody: '',
      commentIsValid: function() {
        var isValid = true;
        ['commentUsername', 'commentBody'].forEach(function(field) {
          if (this.get(field) === '') {
            isValid = false;
          }
        }, this);
        return isValid;
      },
      actions: {
        publishComment: function() {
          if (!this.commentIsValid()) { return; }
          var store = this.get('store');
          Ember.RSVP.hash({
            user: this.get('util').getUserByUsername(this.get('commentUsername'))
          }).then(function(promises) {
            // Create a new comment
            var comment = store.createRecord('comment', {
              body: this.get('commentBody'),
              published: new Date().getTime(),
              user: promises.user
            });
            // Tell the post about the comment
            this.sendAction('onPublishComment', this.get('post'), comment);
            // Reset the fields
            this.setProperties({
              commentUsername: '',
              commentBody: ''
            });
          }.bind(this));
        }
      },
    });

    App.FirePostSlugComponent = Ember.Component.extend({
      classNames: ['post-slug'],
      publishedMonth: function() {
        return this.get('post.published');
      }.property('post.published'),
      publishedDay: function() {
        return this.get('post.published');
      }.property('post.published')
    });

  ////////////////////////////////////////////////////////////
  // Helpers
  ////////////////////////////////////////////////////////////

  Ember.Handlebars.helper('breaklines', function(value, options) {
    var escaped = Ember.Handlebars.Utils.escapeExpression(value);
        escaped = escaped.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new Ember.Handlebars.SafeString(escaped);
  });*/

})(window);