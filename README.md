# EmberFire (Firebase + Ember Data)

EmberFire is an officially supported adapter for using
[Firebase](http://www.firebase.com/?utm_medium=web&utm_source=emberFire) with
[Ember Data](https://github.com/emberjs/data).

The `DS.FirebaseAdapter` provides all of the standard `DS.Adapter` methods and will automatically synchronize the store with Firebase

#### Note
As of version 0.2.0, `EmberFire.Object` and `EmberFire.Array` have been depreciated, but can still be downloaded in the [v0.1.0 release](https://github.com/firebase/emberFire/releases/tag/v0.1.0)

## Installation

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0/handlebars.min.js"></script>
<script src="http://builds.emberjs.com/canary/ember.js"></script>
<script src="http://builds.emberjs.com/canary/ember-data.js"></script>
<script src="https://cdn.firebase.com/v0/firebase.js"></script>
<script src="emberfire-latest.js"></script>
```

## Usage

To get started, simply create an instance of the
`DS.FirebaseAdapter` and `DS.FirebaseSerializer` in your app, like this:

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

If you would like to build EmberFire from the source, use grunt to build and lint the code:

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
