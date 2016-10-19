# Relationships

EmberFire can handle relationships in two different ways: `async` and `embedded`, and currently supports `hasMany` and `belongsTo` relationships.

Unless have a reason and understand the implications we suggest using `inverse: null` in your relationships and saving both sides manually (see [Saving Async Relationship Data](#saving-async-relationship-data) below) due to the nature of the Real-time Database.

## Async

Any relationship that is flagged as `async: true` tells the adapter to immediately fetch the record from the Ember Data store, or look up the record in Firebase.

```js
// app/models/post.js
import DS from 'ember-data';
export default DS.Model.extend({
  comments: DS.hasMany('comment', { async: true, inverse: null })
});
```

In this example, comments will be fetched from `https://your-firebase.firebaseio.com/comments`. Here is what the data structure would look like in the database:

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

> **DEFINING BOTH SIDES OF A RELATIONSHIP**
> You only need to define an async hasMany - belongsTo relationship on both sides if you need to access the data in both ways (e.g. `somePost.comments` and `someComment.post`). When you do define both sides of a relationship, be sure to save both sides when making changes.

### Saving Async Relationship Data

When saving async `hasMany` to `belongsTo` relationships in EmberFire, both sides of the relationship should be saved. To do this in our blog example, we'll push the comment to the store, save the comment, and finally saved the parent post:

```js
// app/controllers/comments/new.js

// Create the comment
var newComment = this.store.createRecord('comment', {
  body: 'My awesome new comment'
});

// Get the parent post
var post = this.get('post');
post.get('comments').addObject(newComment);

// Save the comment, then save the post
newComment.save().then(function() {
  return post.save();
});
```

### Removing Async Relationship Data

When removing a record that has children, you should delete the record's children before deleting the parent. In our example, we can do the following to delete a post:

```js
// app/controllers/posts.js
var post = this.get('post');
var deletions = post.get('comments').map(function(comment) {
  return comment.destroyRecord();
});

// Ensures all comments are deleted before the post
Ember.RSVP.all(deletions)
  .then(function() {
  return post.destroyRecord();
})
.catch(function(e) {
  // Handle errors
});
```

When removing a child record, Ember Data automatically updates the relationship for you. You just need to save the parent record. To remove a comment in our example we can do the following:

```js
// app/controllers/comments.js
var comment = this.get('comment');
var post = comment.get('post');
comment.destroyRecord().then(function() {
  post.save();
});
```

## Embedded

Any relationship that is flagged as async: false tells the adapter that the related records have been included in the payload. Generally, this approach is more complicated and not as widely used, but it has been included to support existing data structures.

> **ASYNC: TRUE IS NOW THE DEFAULT IN EMBERFIRE 1.5.X**
> In previous versions of EmberFire, embedded records were defined in the model with `embedded: true`. In EmberFire versions `1.5.0` and above, using `embedded: true` will not work. Be sure to use `async: false`, remove any mention of `embedded` in the model definition, and create a serializer as described below.

To define embedded records, we can do the following in our **Post** model:

```js
// app/models/post.js
import DS from 'ember-data';
export default DS.Model.extend({
  comments: DS.hasMany('comment', { async: false, inverse: null }),
  metaData: DS.belongsTo('post', { async: false, inverse: null })
});
```

When setting up embedded records we also need to create a serializer with an `attrs` object, like the following:

```js
// app/serializers/post.js
import FirebaseSerializer from 'emberfire/serializers/firebase';
export default FirebaseSerializer.extend({
  attrs: {
    comments: { embedded: 'always' },
    metaData: { embedded: 'always' }
  }
});
```

Now that we've created a serializer to embed the records, here's what the data structure of our embedded comment records would look like in the database:

```json
{
  "posts": {
    "post_id_1": {
      "comments": {
        "comment_id_1": {
          "body": "This is a comment"
        }
      },
      "metaData": {
        "id": "metaData_1",
        "createdAt": 1438039744053,
        "editedAt": 1438039761880
      }
    }
  }
}
```

When a model has embedded relationships, the related model should not be saved on its own. Instead, the comment needs to be added to the post and then the post can be saved.

### Saving Embedded Relationship Data

There is no need to save embedded records directly, since this is handled automatically by EmberFire. When you save the parent, the embedded record changes are also saved. To save a comment with an embedded relationship in our example, we would do the following:

```js
// app/controllers/comments/new.js

var post = this.get('post');
var newComment = this.store.createRecord({
  body: 'My super fun embedded comment'
});

post.get('comments').then(function(comments) {
  comments.addObject(newComment);
  // The comment is automatically saved when we call save() on the parent:
  return post.save();
});
```

### Removing Embedded Relationship Data

When removing a parent record with an embedded relationship, we don't need to go through and delete the children first since they will be deleted automatically.

```js
// app/controllers/posts.js

var post = this.get('post');

// Automatically deletes all children
post.destroyRecord();
```


### Continue reading

1. [Installation](installation.md)
1. [User Authentication](authentication.md)
1. [Saving and Retrieving Data](saving-and-retrieving-data.md)
1. [Querying Data](querying-data.md)
1. **Relationships**
1. [Security Rules](security-rules.md)
1. [Using EmberFire without Ember CLI](without-ember-cli.md)
1. [Deploying to Firebase Hosting](deploying-to-firebase-hosting.md)
