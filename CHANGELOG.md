# EmberFire Changelog

### EmberFire 1.0.8 (April 18, 2014)

* `_getSerializedRecord` now correctly serializes hasMany relationships
* `FirebaseSerializer` now implements `serializeHasMany`

### EmberFire 1.0.7 (April 18, 2014)

* Added `updateRecordCacheForType` to `findAll()`

### EmberFire 1.0.6 (April 18, 2014)

* Initializer is now compatable with new versions of Ember Data

### EmberFire 1.0.5 (April 17, 2014)

* Adding/removing objects to a `hasMany` array now persists to Firebase after `save()`
* Better error handling
* Registed EmberFire with Ember.libraries
* Removed `_enqueue` in `extractSingle` to prevent race condition with embedded records
* `find()` calls `store.dematerializeRecord()` if the record can't be found

### EmberFire 1.0.4 (April 4, 2014)

* _saveHasManyRelationshipRecord bug fix

### EmberFire 1.0.3 (April 1, 2014)

* Added conditional in `find()` to verify that a record can be deleted
* Misc cleanup

### EmberFire 1.0.2 (April 1, 2014)

* Added a `_queue` to batch realtime updates and decrease `Ember.run` calls
* Refactored tests using Mocha
* General cleanup/reorganization

### EmberFire 1.0.1 (March 26, 2014)

* Added support for embedded records
* Setting the ApplicationSerializer is no longer required
* Added unit tests

### EmberFire 1.0.0 (March 24, 2014)

* Added DS.FirebaseAdapter and DS.FirebaseSerializer
* Removed EmberFire.Object and EmberFire.Array

### EmberFire 0.0.1 (September 24, 2013)

* Alpha version of `EmberFire.Object` and `EmberFire.Array`