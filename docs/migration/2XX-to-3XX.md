# Migrating from EmberFire `2.x.x` to `3.x.x`

This migration document covers all the major breaking changes mentioned in the [EmberFire `3.0.0`
change log](https://github.com/firebase/emberfire/releases/tag/v3.0.0).

Install the 3.0 version of emberfire:

```
ember install emberfire@3.0.0
```

## Upgrade to the Firebase `5.x.x` SDK

Ensure you're using a `5.x.x` version of the Firebase SDK in your `package.json`.

```
  "dependencies": {
    "ember": "~2.5.0",
    "ember-cli-shims": "0.1.1",
    "ember-cli-test-loader": "0.2.2",
    "ember-qunit-notifications": "0.1.0",
    "firebase": "^5.0.4"
  }
}
```

Version `3.x.x` of the Firebase SDK is no longer supported with EmberFire version `3.x.x`.

| SDK Version | EmberFire Version Supported |
|-------------|-------------------------------|
| 5.x.x | 3.x.x |
| 3.x.x | 2.x.x |
| 2.x.x | 1.x.x |

Consult the Firebase [web / Node.js migration guide](https://firebase.google.com/support/guides/firebase-web)
for more details on what has changed in the Firebase `5.x.x` SDK.