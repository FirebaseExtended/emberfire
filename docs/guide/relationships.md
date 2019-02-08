# Relationships

EmberFire can handle relationships in several different ways: 

  1. `hasMany` will query for matching records in a root collection
  1. `hasMany` with the `query: ref => ref` allows you to alter to assumed query
  1. `hasMany` with the `subcollection: true` option will query records in a Firestore subcollection
  1. `hasMany` with the `subcollection: true, query: ref => ref` similarly allows you tack on a subcollection query
  1. `hasMany` with the `embedded: true` option will embed the records in the Firestore document
  1. `belongsTo` will query for matching records in a root collection
  1. `belongsTo` with the `query: ref => ref` option allows you to modify the assumed query

## `hasMany`

### Embedded records

... TODO

### Subcollections

... TODO

## `belongsTo`

.. TODO

## Cleaning up relationships

... TODO note about using Cloud Functions for this

### Continue reading

1. [Installation](installation.md)
1. [User Authentication](authentication.md)
1. [Saving and Retrieving Data](saving-and-retrieving-data.md)
1. [Querying Data](querying-data.md)
1. **Relationships**
1. [Security Rules](security-rules.md)
1. [Deploying to Firebase Hosting](deploying-to-firebase-hosting.md)
1. [Fastboot support](fastboot-support.md)
1. [Deploying to Cloud Functions for Firebase](deploying-fastboot-to-cloud-functions.md)
