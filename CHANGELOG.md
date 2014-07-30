v1.1.3
------------------
Release Date: July 30, 2014

* Updated ember-cli compatability

v1.1.2
------------------
Release Date: July 21, 2014

* Fixed npm publish bug

v1.1.1
------------------
Release Date: July 16, 2014

* Fixed `save()` on records with embedded `belongsTo` relationships

v1.1.0
------------------
Release Date: July 16, 2014

* Added support for embedded `belongsTo` relationships

v1.0.9
------------------
Release Date: April 30, 2014

* `updateRecord` now removes serializedRecord on undefined/null belongsTo relationships

v1.0.8
------------------
Release Date: April 18, 2014

* `_getSerializedRecord` now correctly serializes hasMany relationships
* `FirebaseSerializer` now implements `serializeHasMany`

v1.0.7
------------------
Release Date: April 18, 2014

* Added `updateRecordCacheForType` to `findAll()`

v1.0.6
------------------
Release Date: April 18, 2014

* Initializer is now compatable with new versions of Ember Data

v1.0.5
------------------
Release Date: April 17, 2014

* Adding/removing objects to a `hasMany` array now persists to Firebase after `save()`
* Better error handling
* Registed EmberFire with Ember.libraries
* Removed `_enqueue` in `extractSingle` to prevent race condition with embedded records
* `find()` calls `store.dematerializeRecord()` if the record can't be found

v1.0.4
------------------
Release Date: April 4, 2014

* _saveHasManyRelationshipRecord bug fix

v1.0.3
------------------
Release Date: April 1, 2014

* Added conditional in `find()` to verify that a record can be deleted
* Misc cleanup

v1.0.2
------------------
Release Date: April 1, 2014

* Added a `_queue` to batch realtime updates and decrease `Ember.run` calls
* Refactored tests using Mocha
* General cleanup/reorganization

v1.0.1
------------------
Release Date: March 26, 2014

* Added support for embedded records
* Setting the ApplicationSerializer is no longer required
* Added unit tests

v1.0.0
------------------
Release Date: March 24, 2014

* Added DS.FirebaseAdapter and DS.FirebaseSerializer
* Removed EmberFire.Object and EmberFire.Array

v0.0.1
------------------
Release Date: September 24, 2013

* Alpha version of `EmberFire.Object` and `EmberFire.Array`