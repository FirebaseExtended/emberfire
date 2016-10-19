# Authentication

We can add authentication to our app using a [torii provider](https://github.com/Vestorly/torii/#providers-in-torii) built into EmberFire. The first step to set up authentication in our app is installing the torii addon by running:

```
ember install torii
```

Torii can provide your app with a `session` service that holds the currently logged in user. We'll configure that in `config/environment.js`:

```js
// config/environment.js
var ENV = {
  torii: {
    sessionServiceName: 'session'
  }
```

This will inject a `session` property into our routes and controllers.

In order to use Torii, we need to create a `app/torii-adapters/application.js` adapter file with the following code:

```js
import ToriiFirebaseAdapter from 'emberfire/torii-adapters/firebase';
export default ToriiFirebaseAdapter.extend({
});
```

The next step is to enable an authentication provider in the Firebase Authentication panel, and enter the API key and secret for that provider. Details on enabling third-party providers can be found in our docs e.g. [Enabling Twitter login](https://firebase.google.com/docs/auth/web/twitter-login).

In this example we'll use Twitter authentication. To start, we'll define `signIn` and `signOut` actions in our application route making use of the `session` variable:

```js
// app/routes/application.js
import Ember from 'ember';
export default Ember.Route.extend({
  beforeModel: function() {
    return this.get('session').fetch().catch(function() {});
  },
  actions: {
    signIn: function(provider) {
      this.get('session').open('firebase', { provider: provider}).then(function(data) {
        console.log(data.currentUser);
      });
    },
    signOut: function() {
      this.get('session').close();
    }
  }
});
```

In our `beforeModel` hook we call `fetch`, which fetches the current user's session if it exists. Then in the `signIn` action. we pass Firebase the name of the provider we're using. This returns a promise with data on the authenticated user. In the example above we're logging the user object to the console.

In `app/templates/application.hbs` we'll call our `signIn` action when a user clicks the "Sign in with Twitter" button, passing "twitter" as the provider parameter. This makes use of our `session` variable to display the sign in button only to unauthenticated users.

```handlebars
// app/templates/application.hbs
{{#if session.isAuthenticated}}
  Logged in as {{session.currentUser.displayName}}
  <button {{action "signOut"}}>Sign out</button>
  {{outlet}}
{{else}}
  <button {{action "signIn" "twitter"}}>Sign in with Twitter</button>
{{/if}}
```

Authentication with Facebook, GitHub, and Google work similarly once you've enabled them in the Firebase Console.

To request custom scopes from the identity provider, provide a comma separated list of scopes:

```js
this.get('session').open('firebase', {
  provider: 'github',
  settings: {
    scope: 'user,gist',
  }
});
```

To use Firebase's email & password authentication, use `password` as the provider and pass it the user's email and password:

```js
this.get('session').open('firebase', {
  provider: 'password',
  email: 'test@example.com',
  password: 'password1234'
});
```


### Continue reading

1. [Installation](installation.md)
1. **User Authentication**
1. [Saving and Retrieving Data](saving-and-retrieving-data.md)
1. [Querying Data](querying-data.md)
1. [Relationships](relationships.md)
1. [Security Rules](security-rules.md)
1. [Using EmberFire without Ember CLI](without-ember-cli.md)
1. [Deploying to Firebase Hosting](deploying-to-firebase-hosting.md)
