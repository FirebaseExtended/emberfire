# Using EmberFire without Ember CLI

EmberFire also works without ember-cli. We can add EmberFire to an app that doesn't use ember-cli in two simple steps:

## 1. Include Dependencies

To use EmberFire in our project, we'll need to include the following dependencies:

```html
<!-- jQuery -->
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
<!-- Ember + Ember Data -->
<script src="//builds.emberjs.com/tags/v2.6.0/ember.min.js"></script>
<script src="//builds.emberjs.com/tags/v2.6.1/ember-data.min.js"></script>
<!-- Firebase -->
<script src="//www.gstatic.com/firebasejs/3.0.4/firebase.js"></script>
<!-- EmberFire -->
<script src="//cdn.firebase.com/libs/emberfire/2.0.0/emberfire.min.js"></script>
```

## 2. Initialize the FirebaseAdapter

Now that we've included EmberFire and its dependencies, we can create an instance of `DS.FirebaseAdapter` in our app:

```js
App.ApplicationAdapter = DS.FirebaseAdapter.extend({
});
```

Our remote database data will now be synced directly with the Ember Data store.


Next: [Deploying to Firebase Hosting](deploying-to-firebase-hosting.md)
