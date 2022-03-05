# EmberFire [![Build Status](https://travis-ci.org/firebase/emberfire.svg?branch=master)](https://travis-ci.org/firebase/emberfire) [![Version](https://badge.fury.io/gh/firebase%2Femberfire.svg)](http://badge.fury.io/gh/firebase%2Femberfire) [![Monthly Downloads](http://img.shields.io/npm/dm/emberfire.svg?style=flat)](https://www.npmjs.org/package/emberfire) [![Ember Observer Score](http://emberobserver.com/badges/emberfire.svg)](http://emberobserver.com/addons/emberfire)

## Status

![Status: Experimental](https://img.shields.io/badge/Status-Experimental-blue)

This repository is maintained by Googlers but is not a supported Firebase product. Issues here are answered by maintainers and other community members on GitHub on a best-effort basis.

* Ember.js v3.20 or above
* Ember CLI v3.20 or above
* Node.js v12 or above

> **WARNING**: Master branch is the work in progress for version 3 of Emberfire. [You can find version 2 here](https://github.com/firebase/emberfire/tree/v2), if you're looking for documentation or to contribute to stable. [Learn more about the rewrite effort here](https://github.com/firebase/emberfire/issues/542).

---

## Why EmberFire?

- **Developed by experts** - Developed and maintained by the Firebase team
- **Ember Data Adapters** - [Cloud Firestore](https://firebase.google.com/docs/firestore/) and [Realtime Database](https://firebase.google.com/docs/database/) adapters for Ember Data allow you to persist your models in Firebase
- **Ember Services** - `firebase` and `firebase-app` services allow direct access to the underlying [Firebase SDK instance](https://firebase.google.com/docs/reference/js/)
- **Realtime Bindings** - Listen for realtime updates to your Firebase backed Ember Data models using the provided `realtime-listener` service or the `RealtimeRouteMixin`
- **Authentication Providers** - Integrate [Firebase Authentication](https://firebase.google.com/docs/auth/) with your Ember application easily with providers for [Ember Simple Auth](http://ember-simple-auth.com/) and [Torii](http://vestorly.github.io/torii/)
- **Analytics Collection** - The `AnalyticsRouteMixin` adds [Google Analytics](https://firebase.google.com/docs/analytics) screen tracking to your Ember Router.
- **Offline Enabled** - Persist Ember Data models offline automatically with `FirestoreAdapter`
- **Fastboot Compatible** - Perform initial rendering and fetching of your models server-side to increase application performance

## Installation

```bash
$ ember install emberfire@next
```

## Example use

```js
// app/adapters/application.js
import FirestoreAdapter from 'emberfire/adapters/firestore';

export default FirestoreAdapter.extend({
    enablePersistence: true,
    persistenceSettings: { synchronizeTabs: true }
});
```

```js
// app/models/article.js
import DS from 'ember-data';
const { attr, belongsTo, hasMany } = DS;

export default DS.Model.extend({
    title: attr('string'),
    body: attr('string'),
    publishedAt: attr('date'),
    author: belongsTo('user'),
    comments: hasMany('comments', { subcollection: true }),
});
```

```js
// app/routes/articles.js
import Route from '@ember/routing/route';
import RealtimeRouteMixin from 'emberfire/mixins/realtime-route';
import PerformanceRouteMixin from 'emberfire/mixins/performance-route';

export default Route.extend(RealtimeRouteMixin, PerformanceRouteMixin, {
    model() {
        return this.store.query('article', { orderBy: 'publishedAt' });
    }
});
```

```js
// app/routes/application.js
import AnalyticsRouteMixin from 'emberfire/mixins/analytics-route';
import Route from '@ember/routing/route';

export default Route.extend(AnalyticsRouteMixin);
```

## Documentation

* [Quickstart](docs/quickstart.md)
* [Guide](docs/guide/README.md)
* [API Reference](docs/reference/README.md)

## Compatibility

Please consult this table when selecting your version of EmberFire and Firebase SDK:

| Ember Data        | EmberFire | Firebase SDK |
| ------------------| ----------|--------------|
| 3.0+              | 3.x       | 5.x          |
| 2.3+              | 2.x       | 3.x          |
| 2.0 - 2.2         | 1.6.x     | 2.x          |
| 1.13              | 1.5.x     | 2.x          |

## Migration Guides

* [Migrating from EmberFire `2.x` to `3.x`](docs/migration/2XX-to-3XX.md)
* [Migrating from EmberFire `1.x` to `2.x`](docs/migration/1XX-to-2XX.md)

## Contributing

If you'd like to contribute to EmberFire, please first read through our [contribution
guidelines](https://github.com/firebase/emberfire/blob/master/.github/CONTRIBUTING.md). Local setup instructions are available [here](https://github.com/firebase/emberfire/blob/master/.github/CONTRIBUTING.md#local-setup).
