# Querying Data

In our posts template, let's say we want to display the ten most recent blog posts. We can do this with by adding the following parameters to our posts route:

```js
export default Ember.Route.extend({
  model: function() {
    return this.store.find('post', {
      orderBy: 'published',
      limitToLast: 10
    });
  }
});
```

We can combine `orderBy` with `limitToFirst`, `startAt`, `endAt`, and `equalTo` to construct more complex queries. See the documentation on Firebase's [querying methods](https://firebase.google.com/docs/database/web/retrieve-data#sorting_and_filtering_data) for more details.

## Working with security rules

In the above example, if the Real-time database implemented security rules which restricted access to some posts then the query would fail.

We suggest changing your "schema" in cases were you want to restrict access to `findAll`. You can change the path the data is stored in the database by overriding `pathForType` in the adapter.

You can learn more about how we are planning to approach this problem in our ["Allow paths in ids" proposal](https://github.com/firebase/emberfire/issues/432).

Next: [Relationships](relationships.md)
