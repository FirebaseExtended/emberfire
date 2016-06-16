# EmberFire [![Build Status](https://travis-ci.org/firebase/emberfire.svg?branch=master)](https://travis-ci.org/firebase/emberfire) [![Version](https://badge.fury.io/gh/firebase%2Femberfire.svg)](http://badge.fury.io/gh/firebase%2Femberfire) [![Monthly Downloads](http://img.shields.io/npm/dm/emberfire.svg?style=flat)](https://www.npmjs.org/package/emberfire) [![Ember Observer Score](http://emberobserver.com/badges/emberfire.svg)](http://emberobserver.com/addons/emberfire)

EmberFire is the officially supported adapter for using
[Firebase](http://www.firebase.com/?utm_medium=web&utm_source=emberfire) with
[Ember Data](https://github.com/emberjs/data).

Join our [Firebase + Ember Google Group](https://groups.google.com/forum/#!forum/firebase-ember)
to ask technical questions, share apps you've built, and chat with other developers in the community.


## Table of Contents

 * [Getting Started With Firebase](#getting-started-with-firebase)
 * [Installation](#installation)
 * [Compatibility](#compatibility)
 * [Documentation](#documentation)
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
    apiKey: 'xyz',
    authDomain: 'YOUR-FIREBASE-APP.firebaseapp.com',
    databaseURL: 'https://YOUR-FIREBASE-APP.firebaseio.com',
    storageBucket: 'YOUR-FIREBASE-APP.appspot.com',
  }
```


## Compatibility

Please consult this table when selecting your version of EmberFire and Firebase SDK:

| Ember Data        | EmberFire | Firebase SDK |
| ------------------| ----------|--------------|
| 1.13+             | 1.5.x     | 2.x          |
| 2.0 - 2.2         | 1.6.x     | 2.x          |
| 2.3+              | 2.0.x     | 3.x          |
| canary            | master    | 3.x          |

*To install the `master` branch, use `ember install firebase/emberfire#master`*


## Documentation

* [Quickstart](docs/quickstart.md)
* [Guide](docs/guide/README.md)


## Migration Guides

* [Migrating from EmberFire `1.x.x` to `2.x.x`](docs/migration/1XX-to-2XX.md)


## Contributing

If you'd like to contribute to EmberFire, please first read through our [contribution
guidelines](.github/CONTRIBUTING.md). Local setup instructions are available [here](.github/CONTRIBUTING.md#local-setup).
