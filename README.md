EmberFire
=========
EmberFire is an **experimental**, officially supported [EmberJS](http://emberjs.com/)
binding for [Firebase](http://www.firebase.com/?utm_medium=web&utm_source=emberFire).
EmberFire lets you bind Firebase data as models in EmberJS, and will automatically
synchronize changes to and from Firebase.

Usage
-----
EmberFire introduces the `EmberFire` namespace, that provides two objects.
Include the library first, along with Firebase and Ember:

```html
<script src="https://cdn.firebase.com/v0/firebase.js"></script>
<script src="http://builds.emberjs.com/ember-latest.js"></script>
<script src="emberfire-latest.js"></script>
```

### EmberFire.Array

A collection of objects, best suited to maintain lists of items.
`EmberFire.Array` is intended to be used directly as a model, for example:

```js
App.IndexRoute = Ember.Route.extend({
  model: function() {
    return EmberFire.Array.create({
      ref: new Firebase("https://<my-firebase>.firebaseio.com/list")
    });
  }
});
```

**All data stored at the provided Firebase URL will automatically appear in
the model**. You can iterate over the stored objects as you normally would.
For example:

```html
<script type="text/x-handlebars" data-template-name="index">
  {{#each}}
    <div>{{contents}}</div>
  {{/each}}
</script>
```
will iterate over each object in the array and print out the `contents`
property.

**You can manipulate the model using the regular
[MutableArray](http://emberjs.com/api/classes/Ember.MutableArray.html) methods
to save changes to Firebase.** For example, to add a new object to the list:

```html
<script type="text/x-handlebars" data-template-name="index">
  <form {{action "addItem" on="submit"}}>
    {{input value=item}}
    <button type=submit>Add</button>
  </form>
</script>
<script>
  App.IndexController = Ember.ArrayController.extend({
    actions: {
      addItem: function() {
        this.pushObject(this.get("item"));
      }
    }
  });
</script>
```

This works because we previously associated an `EmberFire.Array` instance as
the model for the `IndexController`.

### EmberFire.Object

`EmberFire.Object` works similarly to `EmberFire.Array` and is more suited to
store primitive values or key-value pairs. Nested arrays and objects are
supported. `EmberFire.Object` is also intended to be used directly as a model:

```js
App.IndexRoute = Ember.Route.extend({
  model: function() {
    return EmberFire.Object.create({
      ref: new Firebase("https://<my-firebase>.firebaseio.com/foo")
    });
  }
});
```

**You can manipulate any child of the object directly and changes will
automatically be synchronized with Firebase, both to and from the server.**
For example, the following template:

```html
<script type="text/x-handlebars" data-template-name="index">
  {{bar}}
  {{input type="text" value=bar}}
</script>
```

will synchronize the text value at `https://<my-firebase>.firbaseio.com/foo/bar`
to the text field and vice-versa.

Development
-----------
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

License
-------
[MIT](http://firebase.mit-license.org).
