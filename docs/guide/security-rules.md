# Security Rules

Use security rules to secure your data and enforce data validation. Familiarize
yourself with the 
[security rules documentation](https://firebase.google.com/docs/database/security/securing-data).

When it comes to EmberFire, there are some things you need to know. Firstly, 
Firebase uses the following security rules by default:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

These rule prevent users from reading and writing unless they are 
[authenticated](authentication.md). If are not ready to set up authentication 
for your app, you can set the rules to allow read/write for anyone. This is not 
a recommended approach, but it useful while learning the basics of Firebase and
EmberFire.


```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

We recommend you start with rules that prevent overwriting or editing other 
user's data:

```js
{
  "rules": {
    // default rules are false if not specified

    "posts": {
      ".read": true, // everyone can read all posts

      "$postId": {
        // a new post can be created if it does not exist
        // existing posts can only be edited by their original "author"
        ".write": "!data.exists() && newData.exists() || data.child('author').val() == auth.uid",
        ".validate": "newData.hasChildren(['title', 'author', 'timestamp'])",
      }
    }
  }
}
```

Its a good idea to think about security rules as early as possible, because the
way in which you need to secure data might require certain structures.

Check out the [Bolt compiler](https://github.com/firebase/bolt) for a nice rules
syntax.

## Validation

Emberfire writes `hasMany` relationships in a separate payload. If you have 
validations to check `hasMany` links in the write payload, these might fail. 
See [#305](https://github.com/firebase/emberfire/issues/304) for more  details.

## Querying data

Remember that [rules are not filters](https://firebase.google.com/docs/database/security/securing-data#rules_are_not_filters). When querying data, the user must have 
read access to the entire collection, otherwise Firebase will return an error.

We are [proposing a change](https://github.com/firebase/emberfire/issues/432) 
that will allow queries at deep locations in the database, and these will allow 
queries and security rules to work better together.


### Continue reading

1. [Installation](installation.md)
1. [User Authentication](authentication.md)
1. [Saving and Retrieving Data](saving-and-retrieving-data.md)
1. [Querying Data](querying-data.md)
1. [Relationships](relationships.md)
1. **Security Rules**
1. [Using EmberFire without Ember CLI](without-ember-cli.md)
1. [Deploying to Firebase Hosting](deploying-to-firebase-hosting.md)
