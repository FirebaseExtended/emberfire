# EmberFire (Firebase + Ember Data)

[![Build Status](https://travis-ci.org/firebase/emberfire.svg?branch=master)](https://travis-ci.org/firebase/emberfire)
[![Version](https://badge.fury.io/gh/firebase%2Femberfire.svg)](http://badge.fury.io/gh/firebase%2Femberfire)

**We're aware that there are some issues with the current version of EmberFire, and we'll be working on fixing them in the next couple of weeks.**

EmberFire is the officially supported adapter for using
[Firebase](http://www.firebase.com/?utm_medium=web&utm_source=emberfire) with
[Ember Data](https://github.com/emberjs/data).

The `DS.FirebaseAdapter` provides all of the standard `DS.Adapter` methods and will automatically
synchronize the store with Firebase.

If you would like to use Firebase without Ember Data, we recommend the third-party
[ember-firebase](https://github.com/mjijackson/ember-firebase) binding.

**Join the [Firebase + Ember Google Group](https://groups.google.com/forum/#!forum/firebase-ember)
to ask technical questions, share apps you've built, and chat with other developers in the community.**


## Downloading EmberFire

In order to use EmberFire in your project, you need to include the following files in your HTML:

```html
<!-- Ember + Ember Data -->
<script src="http://builds.emberjs.com/canary/ember.min.js"></script>
<script src="http://builds.emberjs.com/canary/ember-data.min.js"></script>

<!-- Firebase -->
<script src="https://cdn.firebase.com/js/client/1.0.21/firebase.js"></script>

<!-- EmberFire -->
<script src="https://cdn.firebase.com/libs/emberfire/1.1.3/emberfire.min.js"></script>
```

Use the URL above to download both the minified and non-minified versions of EmberFire from the
Firebase CDN. You can also download them from the
[releases page of this GitHub repository](https://github.com/firebase/emberfire/releases).
[Firebase](https://www.firebase.com/docs/web/quickstart.html?utm_medium=web&utm_source=emberfire) and
[Ember](http://emberjs.com/guides/getting-started/obtaining-emberjs-and-dependencies/) can be
downloaded directly from their respective websites.

You can also install EmberFire via Bower and its dependencies will be downloaded automatically:

```bash
$ bower install emberfire --save
```

## Getting Started with Firebase

EmberFire requires Firebase in order to sync data. You can
[sign up here](https://www.firebase.com/signup/?utm_medium=web&utm_source=emberfire) for a free
account.


## Usage

To get started, simply create an instance of the `DS.FirebaseAdapter` in your app:

```javascript
App.ApplicationAdapter = DS.FirebaseAdapter.extend({
  firebase: new Firebase("https://<your-firebase>.firebaseio.com")
});
```

Your Firebase data will now be synced with the Ember Data store.

You can now interact with the data store as you normally would. For example, calling `find()` with
a specific ID will retrieve that record from Firebase. Additionally, from that point on, every time
that record is updated in Firebase, it will automatically be updated in the local data store.

See the [Ember documentation](http://emberjs.com/guides/models/) for a full list of methods,
including ways to create, find, delete and query records.

#### Ember CLI

EmberFire also works with the Ember CLI. Run the following command to add `emberfire.js` to your project:

Temporary install instructions for ember-cli: (v1.2.1 is not yet published to npm)

```bash
$ npm install --save-dev git://github.com/firebase/emberfire#v1.2.1
$ ember generate emberfire
```

Then, all you need to do is create `app/adapters/application.js` with the following content:

```javascript
/* globals Firebase */

export default DS.FirebaseAdapter.extend({
  firebase: new Firebase("https://<your-firebase>.firebaseio.com")
});
```

### Data Structure

By default, EmberFire will try to determine the correct Firebase reference based on the model name.

```javascript
// Define a Post model
App.Post = DS.Model.extend();

// Records will be fetched from to https://<your-firebase>.firebaseio.com/posts
var posts = store.findAll("post");

// The new record will be saved to https://<your-firebase>.firebaseio.com/posts/post_id
var newPost = store.createRecord("post").save();
```

#### What if my data is named differently?

If you would like to customize where a model will be fetched/saved, simply create a model-specific
adapter:

```javascript
// Define a Post model
App.Post = DS.Model.extend();

// Define a Post adapter
App.PostAdapter = App.ApplicationAdapter.extend({
  pathForType: function(type) {
    return "custom-posts";
  }
});
```

Overriding the `pathForType()` method will allow you to tell the adapter where it should fetch/save
records of the specified type.

```javascript
// Records will now be fetched from to https://<your-firebase>.firebaseio.com/custom-posts
var posts = store.findAll("post");

// The new record will now be saved to https://<your-firebase>.firebaseio.com/custom-posts/post_id
var newPost = store.createRecord("post").save();
```

### Relationships

EmberFire can handle relationships in two different ways: async and embedded.

#### Async

Any relationship that is flagged as `async: true` tells the adapter to fetch the record if it
hasn't already been loaded.

```javascript
App.Post = DS.Model.extend({
  comments: DS.hasMany("comment", { async: true })
});

App.Comment = DS.Model.extend({
  post: DS.belongsTo("post", { async: true })
});
```

In the `App.Post` example, comments will be fetched from `https://<your-firebase>.firebaseio.com/comments`.
Here is what the data structure would look like in Firebase:

```json
{
  "posts": {
    "post_id_1": {
      "comments": {
        "comment_id_1": true
      }
    }
  },
  "comments": {
    "comment_id_1": {
      "body": "This is a comment",
      "post": "post_id_1"
    }
  }
}
```

**Note:** If your async data isn't auto-loading, make sure you've defined your relationships in
both directions.

#### Embedded

Any relationship that is flagged as `embedded: true` tells the adapter that the related records
have been included in the payload.

Generally, this approach is more complicated and not as widely used, but it has been included to
support existing data structures.

##### `hasMany()`

```javascript
App.Post = DS.Model.extend({
  comments: DS.hasMany("comment", { embedded: true })
});
```

Here is what the data structure would look like in Firebase:

```json
{
  "posts": {
    "post_id_1": {
      "comments": {
        "comment_id_1": {
          "body": "This is a comment"
        }
      }
    }
  }
}
```

**Note:** When a model has embedded relationships, the related model should not be saved on its own.

```js
var comment = store.createRecord("comment");
// This WILL NOT save the comment inside of the post because the adapter doesn't know
// where to save the comment without the context of the post
comment.save();
```

Instead, the comment needs to be added to the post and then the post can be saved:

```js
// Add the new comment to the post and save it
post.get("comments").addObject(comment);

// Saving the post will save the embedded comments
post.save();
```

##### `belongsTo()`

Any embedded `belongsTo()` relationship must specify an `id` property in the payload:

```json
{
  "posts": {
    "post_id_1": {
      "user": {
        "id": "myusername"
      }
    }
  }
}
```

## Contributing

If you'd like to contribute to EmberFire, you'll need to run the following commands to get your
environment set up:

```bash
$ git clone https://github.com/firebase/emberfire.git
$ cd emberfire              # go to the emberfire directory
$ npm install -g grunt-cli  # globally install grunt task runner
$ npm install -g bower      # globally install Bower package manager
$ npm install               # install local npm build / test dependencies
$ bower install             # install local JavaScript dependencies
$ grunt watch               # watch for source file changes
```

`grunt watch` will watch for changes in the `/src/` directory and lint, concatenate, and minify the
source files and run the test suite when a change occurs. The output files - `emberfire.js` and
`emberfire.min.js` - are written to the `/dist/` directory.

You can run the test suite by navigating to `file:///path/to/emberfire/test/index.html` or via the
command line using `grunt test`.
