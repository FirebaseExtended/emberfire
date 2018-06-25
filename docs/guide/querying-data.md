# Querying Data

In our posts template, let's say we want to display the ten most recent blog posts. We can do this with by adding the following parameter to our posts route:

```js
export default Ember.Route.extend({
  model: function() {
    return this.store.query('post', ref => ref.orderBy('publishedAt', 'desc').limit(10));
  }
});
```

The second argument of the query method allows for modification of the assumed Firestore reference, [learn more about what query options are available in the Firestore documentation.](https://firebase.google.com/docs/firestore/query-data/queries#simple_queries)

## Working with security rules

... TODO flush out


### Continue reading

1. [Installation](installation.md)
1. [User Authentication](authentication.md)
1. [Saving and Retrieving Data](saving-and-retrieving-data.md)
1. **Querying Data**
1. [Relationships](relationships.md)
1. [Security Rules](security-rules.md)
1. [Deploying to Firebase Hosting](deploying-to-firebase-hosting.md)
1. [Fastboot support](fastboot-support.md)
1. [Deploying to Cloud Functions for Firebase](deploying-fastboot-to-cloud-functions.md)