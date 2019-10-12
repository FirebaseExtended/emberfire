# Collect Analytics

## Collect Analytics data automatically with the `AnalyticsRouteMixin`

Emberfire provies a mixin at `emberfire/mixins/analytics-route` which will send data to [Google Analytics](https://firebase.google.com/docs/analytics) on Route changes and track the currently active route.

If you want to track all routes just extend your application route (`app/routes/application.js`) like so:

```js
import AnalyticsRouteMixin from 'emberfire/mixins/analytics-route';
import Route from '@ember/routing/route';

export default Route.extend(AnalyticsRouteMixin);
```

## Log events with the `FirebaseApp` Service

```js
import { inject as service } from '@ember/service';

...

firebaseApp: service('firebase-app'),

...

const analytics = await firebase.analytics();
analytics.logEvent("some_event", { ... });
```

## Collect traces on route transistions automatically with `PerformanceRouteMixin`

```js
import PerformanceRouteMixin from 'emberfire/mixins/performance-route';
import Route from '@ember/routing/route';

export default Route.extend(PerformanceRouteMixin);
```

## Log traces with the `FirebaseApp` Service


```js
import { inject as service } from '@ember/service';

...

firebaseApp: service('firebase-app'),

...

const perf = await firebase.performance();
const trace = perf.trace("some_event");
trace.start();
...
trace.stop()
```

### Continue reading

1. [Installation](installation.md)
1. [User Authentication](authentication.md)
1. **Collect Analytics**
1. [Saving and Retrieving Data](saving-and-retrieving-data.md)
1. [Querying Data](querying-data.md)
1. [Relationships](relationships.md)
1. [Security Rules](security-rules.md)
1. [Deploying to Firebase Hosting](deploying-to-firebase-hosting.md)
1. [Fastboot support](fastboot-support.md)
1. [Deploying to Cloud Functions for Firebase](deploying-fastboot-to-cloud-functions.md)