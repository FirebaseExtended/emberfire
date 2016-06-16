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

Next: [Relationships](relationships.md)
