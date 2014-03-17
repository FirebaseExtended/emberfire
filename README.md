# EmberFire (Firebase + Ember Data)

EmberFire is an officially supported adapter for using
[Firebase](http://www.firebase.com/?utm_medium=web&utm_source=emberFire) with
[Ember Data](https://github.com/emberjs/data).

## Setup

To get started, simply create an instance of the
`FirebaseAdapter` and `FirebaseSerializer` in your app, like this:

```js
App.ApplicationAdapter = DS.FirebaseAdapter.extend({
  firebase: new Firebase('https://<my-firebase>.firebaseio.com')
});
App.ApplicationSerializer = DS.FirebaseSerializer.extend();
```

You can now interact with the data store as you normally would. For example,
calling `find()` with a specific ID will retrieve that record from Firebase.
Additionally, from that point on, every time that record is updated in Firebase,
it will automatically be updated in the local data store.

See the [Ember documentation](http://emberjs.com/guides/models/) for a full
list of methods, including ways to create, find, delete and query records.

## Development

Use grunt to build and lint the code:

```bash
# Install Grunt and development dependencies
npm install

# Default task - validates with jshint and minifies source
grunt

# Watch for changes and run unit test after each change
grunt watch

# Minify source
grunt build
```

## License

[MIT](http://firebase.mit-license.org).
