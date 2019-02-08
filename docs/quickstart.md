# 1. Create an account

The first thing you need to do to get started with EmberFire is sign up for a free Firebase account. A brand new Firebase app will automatically be created for you with its own unique URL ending in `firebaseio.com`.

# 2. Create a new ember-cli app

EmberFire is packaged as an ember-cli addon by default. To get started, install ember-cli, create a new ember-cli application, and `cd` into your app's directory:

```
$ npm install -g ember-cli
$ ember new your-app-name
$ cd your-app-name
```

# 3. Install EmberFire

To install EmberFire, simply run the following command within your ember-cli app directory:

```
$ ember install emberfire
```

This will add Firebase as a dependency in our `package.json` and will generate `app/adapters/application.js` with the following content:

```js
import FirestoreAdapter from 'emberfire/adapters/firestore';

export default FirestoreAdapter.extend({
  // Uncomment the following lines to enable offline persistence and multi-tab support
  // enablePersistence: true,
  // persistenceSettings: { experimentalTabSynchronization: true }
});
```

If you prefer to use the Firebase Realtime Database, you can run the following command `$ ember generate realtime-database-adapter`.

# 4. Configure Firebase

Add your Firebase configuration to `config/environment.js`:

```js
// config/environment.js
var ENV = {
  firebase: {
    apiKey: "xyz",
    authDomain: "YOUR-FIREBASE-APP.firebaseapp.com",
    databaseURL: "https://YOUR-FIREBASE-APP.firebaseio.com",
    projectId: "YOUR-FIREBASE-APP",
    storageBucket: "YOUR-FIREBASE-APP.appspot.com",
    messagingSenderId: "00000000000"
  }
```

Get these values from the [Firebase Console](https://console.firebase.google.com/) by clicking the **[Add Firebase to your web app]** button on the project overview page.

Your Cloud Firestore data will now be synced with the Ember Data store.

# 5. Save Data

Now that your data is being synced with the Ember Data store, calling `save()` on a model will store your data in your project's Firestore instance. To demonstrate, let's build a blogging app.

First, we must update our security rules. By default, Firebase uses security rules that require the client to be authenticated. For the sake of this guide, we will skip the authentication ([read more about it here](guide/authentication.md)). Let's update the security rules to allow unauthenticated users to write data to Firestore.

... TODO Rules for Cloud Firestore

Next we'll create a model for our blog posts. We can do this by running:

```
$ ember generate model post title:string body:string
```

This will generate `app/models/post.js`:

```js
export default DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('string')
});
```

To save our post to our database, we'll do the following:

```js
var newPost = this.store.createRecord('post', {
  title: 'EmberFire is flaming hot!',
  body: 'You can store and sync data in realtime without a backend.'
});
newPost.save();
```

Simply calling `newPost.save()` saves our post to the Data Store and automatically adds it to our database.

# 6. Retrieve Data

Now that we have some post data stored in our database, we need to set up a model hook in our route using `findAll()` to retrieve the data:

```js
//app/routes/posts/index.js
export default Ember.Route.extend({
  model: function() {
    return this.store.findAll('post');
  }
});
```

To display our posts, we can loop through them in our template:

```handlebars
<!-- app/templates/posts.hbs -->
<section>
{{#each model as |post|}}
<div>
  <div>{{post.title}}</div>
  <div>{{post.body}}</div>
</div>
{{/each}}
</section>
```

# 7. Next Steps

This was just a quick run through of the basics of EmberFire. For a more in-depth explanation of how to use the library, continue reading on through the [full guide](guide/README.md).

For an easy way to deploy your Ember app, check out [Firebase Hosting](https://firebase.google.com/docs/hosting/).
