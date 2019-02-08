# EmberFire [![Build Status](https://travis-ci.org/firebase/emberfire.svg?branch=master)](https://travis-ci.org/firebase/emberfire) [![Version](https://badge.fury.io/gh/firebase%2Femberfire.svg)](http://badge.fury.io/gh/firebase%2Femberfire) [![Monthly Downloads](http://img.shields.io/npm/dm/emberfire.svg?style=flat)](https://www.npmjs.org/package/emberfire) [![Ember Observer Score](http://emberobserver.com/badges/emberfire.svg)](http://emberobserver.com/addons/emberfire)

EmberFire is the officially supported adapter for using
[Firebase](http://www.firebase.com/?utm_medium=web&utm_source=emberfire) with [Ember](https://www.emberjs.com/) and 
[Ember Data](https://guides.emberjs.com/release/models/).

Join the [Firebase Google Group](https://groups.google.com/forum/#!forum/firebase-talk)
to ask technical questions, share apps you've built, and chat with other developers in the community. You can also find us in the [Firebase Community Slack](https://firebase.community/) (look for the `#ember` room) or [Stack Overflow](https://stackoverflow.com/questions/tagged/emberfire).

---

> **WARNING**: Master branch is the work in progress for version 3 of Emberfire. You can find [version 2 here](https://github.com/firebase/emberfire/tree/v2), if you're looking for documentation or to contribute a fix for stable. [Learn more about the rewrite effort here](https://github.com/firebase/emberfire/issues/542).

---

## Table of Contents

 * [Getting Started With Firebase](#getting-started-with-firebase)
 * [Installation](#installation)
 * [Documentation](#documentation)
 * [Compatibility](#compatibility)
 * [Migration Guides](#migration-guides)
 * [Contributing](#contributing)

## Getting Started With Firebase

EmberFire requires [Firebase](https://firebase.google.com/) in order to authenticate users and sync
and store data. Firebase is a suite of integrated products designed to help you develop your app,
grow your user base, and earn money. You can [sign up here for a free account](https://console.firebase.google.com/).


## Installation

```bash
$ ember install emberfire
```

Update `config/environment.js`

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
}
```

Get these values from the [Firebase Console](https://console.firebase.google.com/) by clicking the **[Add Firebase to your web app]** button on the project overview page.

## Documentation

* [Quickstart](docs/quickstart.md)
* [Guide](docs/guide/README.md)
* [API Reference](docs/reference/README.md)

## Compatibility

Please consult this table when selecting your version of EmberFire and Firebase SDK:

| Ember Data        | EmberFire | Firebase SDK |
| ------------------| ----------|--------------|
| 3.0+              | 3.0.x     | 5.x          |
| 2.3+              | 2.x       | 3.x          |
| 2.0 - 2.2         | 1.6.x     | 2.x          |
| 1.13              | 1.5.x     | 2.x          |

## Migration Guides

* [Migrating from EmberFire `2.x` to `3.x`](docs/migration/2XX-to-3XX.md)
* [Migrating from EmberFire `1.x` to `2.x`](docs/migration/1XX-to-2XX.md)

## Contributing

If you'd like to contribute to EmberFire, please first read through our [contribution
guidelines](https://github.com/firebase/emberfire/blob/master/.github/CONTRIBUTING.md). Local setup instructions are available [here](https://github.com/firebase/emberfire/blob/master/.github/CONTRIBUTING.md#local-setup).