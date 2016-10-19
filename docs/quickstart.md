# 1. Create an account

The first thing you need to do to get started with EmberFire is sign up for a free Firebase account. A brand new Firebase app will automatically be created for you with its own unique URL ending in `firebaseio.com`.

# 2. Create a new ember-cli app

EmberFire is packaged as an ember-cli addon by default. To get started, install ember-cli, create a new ember-cli application, and `cd` into your app's directory:

```
$ npm install -g ember-cli bower
$ ember new your-app-name
$ cd your-app-name
```

# 3. Install EmberFire

To install EmberFire, simply run the following command within your ember-cli app directory:

```
$ ember install emberfire
```

This will add Firebase as a dependency in our `bower.json` file and it will generate `app/adapters/application.js` with the following content:

```js
import FirebaseAdapter from 'emberfire/adapters/firebase';
export default FirebaseAdapter.extend({
});
```

# 4. Configure your Firebase database URL

Your `app/adapters/application.js` references config.firebase. Next, add your Firebase database URL to `config/environment.js`:

```js
var ENV = {
  // ...
  firebase: {
    apiKey: 'xyz',
    authDomain: 'YOUR-FIREBASE-APP.firebaseapp.com',
    databaseURL: 'https://YOUR-FIREBASE-APP.firebaseio.com',
    storageBucket: 'YOUR-FIREBASE-APP.appspot.com',
  },
```

Your database data will now be synced with the Ember Data store.

# 5. Save Data

Now that your data is being synced with the Ember Data store, calling `save()` on a model will store your data in your database. To demonstrate, let's build a blogging app. The data for our app will be stored at the Firebase database URL we initialized in the previous step. 

First, we must update our security rules. By default, Firebase uses security rules that require the client to be authenticated. For the sake of this guide, we will skip the authentication ([read more about it here](guide/authentication.md)). Let's update the security rules to allow unauthenticated users to write data to the database.

Open the [security rules](https://console.firebase.google.com/project/_/database/rules) panel and save the following rules:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

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
