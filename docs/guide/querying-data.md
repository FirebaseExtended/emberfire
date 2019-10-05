# Querying Data

In our posts template, let's say we want to display the ten most recent blog posts. We can do this with by adding the following parameter to our posts route:

```js
export default Ember.Route.extend({
  model: function() {
    return this.store.query('post', { orderBy: { publishedAt: 'desc' }, limit: 10 });
  }
});
```

Alternatively we can directly modify the the assumed Firestore reference, [learn more about what query options are available in the Firestore documentation](https://firebase.google.com/docs/firestore/query-data/queries#simple_queries):

```js
export default Ember.Route.extend({
  model: function() {
    return this.store.query('post', { query: ref => ref.orderBy('publishedAt', 'desc').limit(10) });
  }
});
```

This is useful for more advanced use cases.

# Getting realtime updates to our queries

Use the `RealtimeRouteMixin` to get updates to records in your query while your route is in view.

```js
import RealtimeRouteMixin from 'emberfire/mixins/realtime-route';

export default Route.extend(RealtimeRouteMixin, {
  model: function() {
    return this.store.query('post', { orderBy: { publishedAt: 'desc' }, limit: 10 });
  }
});
```

## Query Options

### Firestore

TODO write about the options available

```ts
    filter?: {[key:string]:any},
    where?: WhereOp|WhereOp[],
    endAt?: BoundOp,
    endBefore?: BoundOp,
    startAt?: BoundOp,
    startAfter?: BoundOp,
    orderBy?: OrderOp,
    include?: string
```

#### Query

```ts
    query?: (CollectionReference) => (Query|CollectionReference), 
    limit?: number
```

#### QueryRecord

```ts
    doc?: (CollectionReference) => (Query|DocumentReference)
```

### Realtime Database

```ts
    query?: (Reference) => Reference,
    filter?: {[key:string]:string|number|boolean|null},
    endAt?: BoundOp,
    equalTo?: BoundOp,
    limitToFirst?: number,
    limitToLast?: number,
    orderBy?: string|OrderBy,
    startAt?: BoundOp
```

#### Query

```ts
    limit?: number
```

## Working with security rules

... TODO flush out


### Continue reading

1. [Installation](installation.md)
1. [User Authentication](authentication.md)
1. [Collect Analytics](analytics.md)
1. [Saving and Retrieving Data](saving-and-retrieving-data.md)
1. **Querying Data**
1. [Relationships](relationships.md)
1. [Security Rules](security-rules.md)
1. [Deploying to Firebase Hosting](deploying-to-firebase-hosting.md)
1. [Fastboot support](fastboot-support.md)
1. [Deploying to Cloud Functions for Firebase](deploying-fastboot-to-cloud-functions.md)
