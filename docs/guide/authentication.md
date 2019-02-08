# Authentication

## Ember Simple Auth

We can add authentication to our app using the [Ember Simple Auth session store](hhttps://github.com/simplabs/ember-simple-auth#session-stores) built into EmberFire. The first step to set up authentication in our app is installing the ember-simple-auth addon by running:

```
$ ember install ember-simple-auth
```

In order to use Ember Simple Auth, we need to create a `app/session-stores/application.js` file with the following command:

```
$ ember generate firebase-session-store
```

The next step is to enable an authentication provider in the Firebase Authentication panel, and enter the API key and secret for that provider. Details on enabling third-party providers can be found in our docs e.g. [Enabling Google Sign-In](https://firebase.google.com/docs/auth/web/google-signin).

In this example we'll use Google authentication. To start, we'll define `login` and `logout` actions in our application route making use of the `session` and `firebaseApp` services:

```js
// app/routes/application.js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import firebase from 'firebase/app';

export default Route.extend({
    session: service(),
    firebaseApp: service(),
    actions: {
        logout() {
            return this.get('session').invalidate();
        },
        async login() {
            const provider = new firebase.auth.GoogleAuthProvider();
            const auth = await this.get('firebaseApp').auth();
            return auth.signInWithPopup(provider);
        }
    }
});
```

In the `login` action we pass Firebase the provider we're using; note we're calling Firebase Authentication methods directly rather than calling into Ember Simple Auth. The Ember Simple Auth session store in emberfire will listen for success and will update the session itself; no need for you to worry about it.

In `app/templates/application.hbs` we'll call our `login` action when a user clicks the "Sign in with Twitter" button, passing "twitter" as the provider parameter. This makes use of our `session` variable to display the sign in button only to unauthenticated users.

```handlebars
// app/templates/application.hbs
{{#if session.isAuthenticated}}
  Logged in as {{ session.data.authenticated.user.displayName }}
  <button {{action "logout"}}>Sign out</button>
  {{outlet}}
{{else}}
  <button {{action "login"}}>Sign in with Google</button>
{{/if}}
```

## Torii

We can add authentication to our app using a [torii provider](https://github.com/Vestorly/torii/#providers-in-torii) built into EmberFire. The first step to set up authentication in our app is installing the torii addon by running:

```
$ ember install torii
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

In order to use Torii, we need to create a `app/torii-adapters/application.js` adapter file with the following command:

```
$ ember generate firebase-torii-adapter
```

The next step is to enable an authentication provider in the Firebase Authentication panel, and enter the API key and secret for that provider. Details on enabling third-party providers can be found in our docs e.g. [Enabling Twitter login](https://firebase.google.com/docs/auth/web/twitter-login).

In this example we'll use Google authentication. To start, we'll define `login` and `logout` actions in our application route making use of the `session` and `firebaseApp` services:

```js
// app/routes/application.js
import { get } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import firebase from 'firebase/app';

export default Route.extend({
    session: service(),
    firebaseApp: service(),
    beforeModel: function() {
      return get(this, 'session').fetch().catch(() => {});
    },
    actions: {
        logout() {
            return get(this, 'session').close();
        },
        async login() {
            const provider = new firebase.auth.GoogleAuthProvider();
            const auth = await get(this, 'firebaseApp').auth();
            return auth.signInWithPopup(provider);
        }
    }
});
```

In our `beforeModel` hook we call `fetch`, which fetches the current user's session if it exists. 

Then in the `login` action we pass Firebase the provider we're using; note we're calling Firebase Authentication methods directly rather than calling into Torii. The Torii adapter in emberfire will listen for success and open a Torii session itself; no need for you to worry about it.

In `app/templates/application.hbs` we'll call our `login` action when a user clicks the "Sign in with Twitter" button, passing "twitter" as the provider parameter. This makes use of our `session` variable to display the sign in button only to unauthenticated users.

```handlebars
// app/templates/application.hbs
{{#if session.isAuthenticated}}
  Logged in as {{session.currentUser.displayName}}
  <button {{action "logout"}}>Sign out</button>
  {{outlet}}
{{else}}
  <button {{action "login"}}>Sign in with Google</button>
{{/if}}
```

### Continue reading

1. [Installation](installation.md)
1. **User Authentication**
1. [Saving and Retrieving Data](saving-and-retrieving-data.md)
1. [Querying Data](querying-data.md)
1. [Relationships](relationships.md)
1. [Security Rules](security-rules.md)
1. [Deploying to Firebase Hosting](deploying-to-firebase-hosting.md)
1. [Fastboot support](fastboot-support.md)
1. [Deploying to Cloud Functions for Firebase](deploying-fastboot-to-cloud-functions.md)