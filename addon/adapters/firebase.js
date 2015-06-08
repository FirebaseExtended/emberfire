import Ember from 'ember';
import DS from 'ember-data';
import toPromise from '../utils/to-promise';

var fmt = Ember.String.fmt;
var Promise = Ember.RSVP.Promise;
var forEach = Ember.EnumerableUtils.forEach;
var filter = Ember.EnumerableUtils.filter;
var map = Ember.EnumerableUtils.map;
var indexOf = Ember.EnumerableUtils.indexOf;

var uniq = function (arr) {
  var ret = Ember.A();

  arr.forEach(function(k) {
    if (indexOf(ret, k) < 0) {
      ret.push(k);
    }
  });

  return ret;
};

/**
  The Firebase adapter allows your store to communicate with the Firebase
  realtime service. To use the adapter in your app, extend DS.FirebaseAdapter
  and customize the endpoint to point to the Firebase URL where you want this
  data to be stored.

  The adapter will automatically communicate with Firebase to persist your
  records as neccessary. Importantly, the adapter will also update the store
  in realtime when changes are made to the Firebase by other clients or
  otherwise.
*/
export default DS.Adapter.extend(Ember.Evented, {

  defaultSerializer: '-firebase',

  /**
    Endpoint paths can be customized by setting the Firebase property on the
    adapter:

    ```js
    DS.FirebaseAdapter.extend({
      firebase: new Firebase('https://<my-firebase>.firebaseio.com/')
    });
    ```

    Requests for `App.Post` now target `https://<my-firebase>.firebaseio.com/posts`.

    @property firebase
    @type {Firebase}
  */

  init: function() {
    var firebase = this.get('firebase');
    if (!firebase || typeof firebase !== 'object') {
      throw new Error('Please set the `firebase` property on the adapter.');
    }
    // If provided Firebase reference was a query (eg: limits), make it a ref.
    this._ref = firebase.ref();
    // Keep track of what types `.findAll()` has been called for
    this._findAllMapForType = {};
    // Keep a cache to check modified relationships against
    this._recordCacheForType = {};
    // Used to batch records into the store
    this._queue = [];
  },

  /**
    Uses push() to generate chronologically ordered unique IDs.
  */
  generateIdForRecord: function() {
    return this._getKey(this._ref.push());
  },

  /**
    Use the Firebase DataSnapshot's key as the record id

    @param {Object} snapshot - A Firebase snapshot
    @param {Object} payload - The payload that will be pushed into the store
    @return {Object} payload
  */
  _assignIdToPayload: function(snapshot) {
    var payload = snapshot.val();
    if (payload !== null && typeof payload === 'object' && typeof payload.id === 'undefined') {
      payload.id = this._getKey(snapshot);
    }
    return payload;
  },

  /**
    Called by the store to retrieve the JSON for a given type and ID. The
    method will return a promise which will resolve when the value is
    successfully fetched from Firebase.

    Additionally, from this point on, the object's value in the store will
    also be automatically updated whenever the remote value changes.
  */
  findRecord: function(store, typeClass, id) {
    var adapter = this;
    var ref = this._getRef(typeClass, id);

    return new Promise(function(resolve, reject) {
      ref.once('value', function(snapshot) {
        var payload = adapter._assignIdToPayload(snapshot);
        adapter._updateRecordCacheForType(typeClass, payload);
        if (payload === null) {
          var error = new Error(fmt('no record was found at %@', [ref.toString()]));
              error.recordId = id;
          reject(error);
        }
        else {
          resolve(payload);
        }
      },
      function(err) {
        reject(err);
      });
    }, fmt('DS: FirebaseAdapter#findRecord %@ to %@', [typeClass.modelName, ref.toString()]));
  },

  recordWasPushed: function(store, modelName, record) {
    if (!record.__listening) {
      var typeClass = store.modelFor(modelName);
      this.listenForChanges(store, typeClass, record);
    }
  },

  recordWillUnload: function(store, record) {
    var ref = this._getRef(record.constructor, record.get('id'));
    ref.off('value');
  },

  recordWillDelete: function(store, record) {
    var adapter = this;

    record.eachRelationship(function (key, relationship) {
      if (relationship.kind === 'belongsTo') {
        var parentRecord = record.get(relationship.key);
        var inverseKey = record.inverseFor(relationship.key);
        if (inverseKey && parentRecord.get('id')) {
          var parentRef = adapter._getRef(inverseKey.type, parentRecord.get('id'));
          adapter._removeHasManyRecord(store, parentRef, inverseKey.name, record.id);
        }
      }
    });
  },

  listenForChanges: function(store, typeClass, record) {
    record.__listening = true;
    var adapter = this;
    var ref = this._getRef(typeClass, record.get('id'));
    var called = false;
    ref.on('value', function FirebaseAdapter$changeListener(snapshot) {
      if (called) {
        adapter._handleChildValue(store, typeClass, snapshot);
      }
      called = true;
    });
  },

  /**
   findMany
  */
  findMany: undefined,

  /**
    Called by the store to retrieve the JSON for all of the records for a
    given type. The method will return a promise which will resolve when the
    value is successfully fetched from Firebase.

    Additionally, from this point on, any records of this type that are added,
    removed or modified from Firebase will automatically be reflected in the
    store.
  */
  findAll: function(store, typeClass) {
    var adapter = this;
    var ref = this._getRef(typeClass);

    return new Promise(function(resolve, reject) {
      // Listen for child events on the type
      ref.once('value', function(snapshot) {
        if (!adapter._findAllHasEventsForType(typeClass)) {
          adapter._findAllAddEventListeners(store, typeClass, ref);
        }
        var results = [];
        snapshot.forEach(function(childSnapshot) {
          var payload = adapter._assignIdToPayload(childSnapshot);
          adapter._updateRecordCacheForType(typeClass, payload);
          results.push(payload);
        });
        resolve(results);
      }, function(error) {
        reject(error);
      });
    }, fmt('DS: FirebaseAdapter#findAll %@ to %@', [typeClass.modelName, ref.toString()]));
  },

  query: function(store, typeClass, query, recordArray) {
    var adapter = this;
    var ref = this._getRef(typeClass);
    var modelName = typeClass.modelName;

    ref = this.applyQueryToRef(ref, query);

    ref.on('child_added', function(snapshot) {
      var record = store.peekRecord(modelName, snapshot.key());

      if (!record || !record.__listening) {
        var payload = adapter._assignIdToPayload(snapshot);
        var serializer = store.serializerFor(modelName);
        adapter._updateRecordCacheForType(typeClass, payload);
        record = store.push(modelName, serializer.extractSingle(store, typeClass, payload));
      }

      if (record) {
        recordArray.get('content').addObject(record._internalModel);
      }
    });

    // `child_changed` is already handled by the record's
    // value listener after a store.push. `child_moved` is
    // a much less common case because it relates to priority

    ref.on('child_removed', function(snapshot) {
      var record = store.peekRecord(modelName, snapshot.key());
      if (record) {
        recordArray.get('content').removeObject(record._internalModel);
      }
    });

    // clean up event handlers when the array is being destroyed
    // so that future firebase events wont keep trying to use a
    // destroyed store/serializer
    recordArray.__firebaseCleanup = function () {
      ref.off('child_added');
      ref.off('child_removed');
    };

    return new Promise(function(resolve, reject) {
      // Listen for child events on the type
      ref.once('value', function(snapshot) {
        if (!adapter._findAllHasEventsForType(typeClass)) {
          adapter._findAllAddEventListeners(store, typeClass, ref);
        }
        var results = [];
        snapshot.forEach(function(childSnapshot) {
          var payload = adapter._assignIdToPayload(childSnapshot);
          adapter._updateRecordCacheForType(typeClass, payload);
          results.push(payload);
        });
        resolve(results);
      }, function(error) {
        reject(error);
      });
    }, fmt('DS: FirebaseAdapter#query %@ with %@', [modelName, query]));
  },

  applyQueryToRef: function (ref, query) {

    if (!query.orderBy) {
      query.orderBy = '_key';
    }

    if (query.orderBy === '_key'){
      ref = ref.orderByKey();
    } else if (query.orderBy === '_value') {
      ref = ref.orderByValue();
    } else if (query.orderBy === '_priority') {
      ref = ref.orderByPriority();
    } else {
      ref = ref.orderByChild(query.orderBy);
    }

    ['limitToFirst', 'limitToLast', 'startAt', 'endAt', 'equalTo'].forEach(function (key) {
      if (query[key] || query[key] === '') {
        ref = ref[key](query[key]);
      }
    });

    return ref;
  },

  /**
    Keep track of what types `.findAll()` has been called for
    so duplicate listeners aren't added
  */
  _findAllMapForType: undefined,

  /**
    Determine if the current type is already listening for children events
  */
  _findAllHasEventsForType: function(typeClass) {
    return !Ember.isNone(this._findAllMapForType[typeClass.modelName]);
  },

  /**
    After `.findAll()` is called on a modelName, continue to listen for
    `child_added`, `child_removed`, and `child_changed`
  */
  _findAllAddEventListeners: function(store, typeClass, ref) {
    var modelName = typeClass.modelName;
    this._findAllMapForType[modelName] = true;

    var adapter = this;
    ref.on('child_added', function(snapshot) {
      if (!store.hasRecordForId(modelName, adapter._getKey(snapshot))) {
        adapter._handleChildValue(store, typeClass, snapshot);
      }
    });
  },

  /**
    Push a new child record into the store
  */
  _handleChildValue: function(store, typeClass, snapshot) {
    // No idea why we need this, we are already turning off the callback by
    // calling ref.off in recordWillUnload. Something is fishy here
    if (store.isDestroying) {
      return;
    }
    var value = snapshot.val();
    if (value === null) {
      var id = this._getKey(snapshot);
      var record = store.peekRecord(typeClass.modelName, id);
      // TODO: refactor using ED
      if (!record.get('isDeleted')) {
        record.deleteRecord();
      }
    } else {
      var payload = this._assignIdToPayload(snapshot);

      // firebase doesn't send the property for empty relationships
      typeClass.eachRelationship(function (key, relationship) {
        if (relationship.kind === 'hasMany' && !payload[key]) {
          payload[key] = {};
        }
      });

      this._enqueue(function FirebaseAdapter$enqueueStorePush() {
        if (!store.isDestroying) {
          var serializer = store.serializerFor(typeClass.modelName);
          store.push(typeClass.modelName, serializer.extractSingle(store, typeClass, payload));
        }
      });
    }
  },

  /**
    `createRecord` is an alias for `updateRecord` because calling \
    `ref.set()` would wipe out any existing relationships
  */
  createRecord: function(store, typeClass, snapshot) {
    var adapter = this;
    var record = snapshot.record || snapshot;
    return this.updateRecord(store, typeClass, snapshot).then(function() {
      adapter.listenForChanges(store, typeClass, record);
    });
  },

  /**
    Called by the store when a record is created/updated via the `save`
    method on a model record instance.

    The `updateRecord` method serializes the record and performs an `update()`
    at the the Firebase location and a `.set()` at any relationship locations
    The method will return a promise which will be resolved when the data and
    any relationships have been successfully saved to Firebase.

    We take an optional record reference, in order for this method to be usable
    for saving nested records as well.

  */
  updateRecord: function(store, typeClass, snapshot) {
    var adapter = this;
    var record = snapshot.record || snapshot;
    var recordRef = record.__firebaseRef || this._getRef(typeClass, record.get('id'));
    var recordCache = adapter._getRecordCache(typeClass, record.get('id'));

    var pathPieces = recordRef.path.toString().split('/');
    var lastPiece = pathPieces[pathPieces.length-1];
    var serializedRecord = record.serialize({
      includeId: (lastPiece !== record.id) // record has no firebase `key` in path
    });

    return new Promise(function(resolve, reject) {
      var savedRelationships = Ember.A();
      record.eachRelationship(function(key, relationship) {
        var save;
        if (relationship.kind === 'hasMany') {
          if (serializedRecord[key]) {
            save = adapter._saveHasManyRelationship(store, typeClass, relationship, serializedRecord[key], recordRef, recordCache);
            savedRelationships.push(save);
            // Remove the relationship from the serializedRecord because otherwise we would clobber the entire hasMany
            delete serializedRecord[key];
          }
        } else {
          if (relationship.options.embedded === true && serializedRecord[key]) {
            save = adapter._saveBelongsToRecord(store, typeClass, relationship, serializedRecord[key], recordRef);
            savedRelationships.push(save);
            delete serializedRecord[key];
          }
        }
      });

      var relationshipsPromise = Ember.RSVP.allSettled(savedRelationships);
      var recordPromise = adapter._updateRecord(recordRef, serializedRecord);

      Ember.RSVP.hashSettled({relationships: relationshipsPromise, record: recordPromise}).then(function(promises) {
        var rejected = Ember.A(promises.relationships.value).filterBy('state', 'rejected');
        if (promises.record.state === 'rejected') {
          rejected.push(promises.record);
        }
        // Throw an error if any of the relationships failed to save
        if (rejected.length !== 0) {
          var error = new Error(fmt('Some errors were encountered while saving %@ %@', [typeClass, record.id]));
              error.errors = rejected.mapBy('reason');
          reject(error);
        } else {
          resolve();
        }
      });
    }, fmt('DS: FirebaseAdapter#updateRecord %@ to %@', [typeClass, recordRef.toString()]));
  },

  //Just update the record itself without caring for the relationships
  _updateRecord: function(recordRef, serializedRecord) {
    return toPromise(recordRef.update, recordRef, [serializedRecord]);
  },

  /**
    Call _saveHasManyRelationshipRecord on each record in the relationship
    and then resolve once they have all settled
  */
  _saveHasManyRelationship: function(store, typeClass, relationship, ids, recordRef, recordCache) {
    if (!Ember.isArray(ids)) {
      throw new Error('hasMany relationships must must be an array');
    }
    var adapter = this;
    var idsCache = Ember.A(recordCache[relationship.key]);
    var dirtyRecords = [];

    // Added
    var addedRecords = filter(ids, function(id) {
      return !idsCache.contains(id);
    });

    // Dirty
    dirtyRecords = filter(ids, function(id) {
      var relatedModelName = relationship.type;
      return store.hasRecordForId(relatedModelName, id) && store.peekRecord(relatedModelName, id).get('hasDirtyAttributes') === true;
    });

    dirtyRecords = map(uniq(dirtyRecords.concat(addedRecords)), function(id) {
      return adapter._saveHasManyRecord(store, relationship, recordRef, id);
    });

    // Removed
    var removedRecords = filter(idsCache, function(id) {
      return !ids.contains(id);
    });

    removedRecords = map(removedRecords, function(id) {
      return adapter._removeHasManyRecord(store, recordRef, relationship.key, id);
    });
    // Combine all the saved records
    var savedRecords = dirtyRecords.concat(removedRecords);
    // Wait for all the updates to finish
    return Ember.RSVP.allSettled(savedRecords).then(function(savedRecords) {
      var rejected = Ember.A(Ember.A(savedRecords).filterBy('state', 'rejected'));
      if (rejected.get('length') === 0) {
        // Update the cache
        recordCache[relationship.key] = ids;
        return savedRecords;
      }
      else {
        var error = new Error(fmt('Some errors were encountered while saving a hasMany relationship %@ -> %@', [relationship.parentType, relationship.type]));
            error.errors = Ember.A(rejected).mapBy('reason');
        throw error;
      }
    });
  },

  /**
    If the relationship is `async: true`, create a child ref
    named with the record id and set the value to true

    If the relationship is `embedded: true`, create a child ref
    named with the record id and update the value to the serialized
    version of the record
  */
  _saveHasManyRecord: function(store, relationship, parentRef, id) {
    var ref = this._getRelationshipRef(parentRef, relationship.key, id);
    var record = store.peekRecord(relationship.type, id);
    var isEmbedded = relationship.options.embedded === true;
    if (isEmbedded) {
      record.__firebaseRef = ref;
      return record.save();
    }

    return toPromise(ref.set, ref,  [true]);
  },

  /**
    Remove a relationship
  */
  _removeHasManyRecord: function(store, parentRef, key, id) {
    var ref = this._getRelationshipRef(parentRef, key, id);
    return toPromise(ref.remove, ref, [], ref.toString());
  },

  /**
    Save an embedded record
  */
  _saveBelongsToRecord: function(store, typeClass, relationship, id, parentRef) {
    var record = store.peekRecord(relationship.type, id);
    record.__firebaseRef = parentRef.child(relationship.key);
    return record.save();
  },

  /**
    Called by the store when a record is deleted.
  */
  deleteRecord: function(store, typeClass, snapshot) {
    var record = snapshot.record || snapshot;
    var ref = record.__firebaseRef || this._getRef(typeClass, record.get('id'));
    return toPromise(ref.remove, ref);
  },

  /**
    Determines a path fo a given type
  */
  pathForType: function(modelName) {
    var camelized = Ember.String.camelize(modelName);
    return Ember.String.pluralize(camelized);
  },

  /**
    Return a Firebase reference for a given modelName and optional ID.
  */
  _getRef: function(typeClass, id) {
    var ref = this._ref;
    if (typeClass) {
      ref = ref.child(this.pathForType(typeClass.modelName));
    }
    if (id) {
      ref = ref.child(id);
    }
    return ref;
  },

  /**
    Return a Firebase reference based on a relationship key and record id
  */
  _getRelationshipRef: function(ref, key, id) {
    return ref.child(key).child(id);
  },

  /**
    The amount of time (ms) before the _queue is flushed
  */
  _queueFlushDelay: (1000/60), // 60fps

  /**
    Called after the first item is pushed into the _queue
  */
  _queueScheduleFlush: function() {
    Ember.run.later(this, this._queueFlush, this._queueFlushDelay);
  },

  /**
    Call each function in the _queue and the reset the _queue
  */
  _queueFlush: function() {
    forEach(this._queue, function FirebaseAdapter$flushQueueItem(queueItem) {
      var fn = queueItem[0];
      var args = queueItem[1];
      fn.apply(null, args);
    });
    this._queue.length = 0;
  },

  /**
    Push a new function into the _queue and then schedule a
    flush if the item is the first to be pushed
  */
  _enqueue: function(callback, args) {
    //Only do the queueing if we scheduled a delay
    if (this._queueFlushDelay) {
      var length = this._queue.push([callback, args]);
      if (length === 1) {
        this._queueScheduleFlush();
      }
    } else {
      callback.apply(null, args);
    }
  },

  /**
    A cache of hasMany relationships that can be used to
    diff against new relationships when a model is saved
  */
  _recordCacheForType: undefined,

  /**
    _updateHasManyCacheForType
  */
  _updateRecordCacheForType: function(typeClass, payload) {
    if (!payload) { return; }
    var id = payload.id;
    var cache = this._getRecordCache(typeClass, id);
    // Only cache relationships for now
    typeClass.eachRelationship(function(key, relationship) {
      if (relationship.kind === 'hasMany') {
        var ids = payload[key];
        cache[key] = !Ember.isNone(ids) ? Ember.A(Ember.keys(ids)) : Ember.A();
      }
    });
  },

  /**
    Get or create the cache for a record
   */
  _getRecordCache: function (typeClass, id) {
    var modelName = typeClass.modelName;
    var cache = this._recordCacheForType;
    cache[modelName] = cache[modelName] || {};
    cache[modelName][id] = cache[modelName][id] || {};
    return cache[modelName][id];
  },

  /**
   * A utility for retrieving the key name of a Firebase ref or
   * DataSnapshot. This is backwards-compatible with `name()`
   * from Firebase 1.x.x and `key()` from Firebase 2.0.0+. Once
   * support for Firebase 1.x.x is dropped in EmberFire, this
   * helper can be removed.
   */
  _getKey: function(refOrSnapshot) {
    return (typeof refOrSnapshot.key === 'function') ? refOrSnapshot.key() : refOrSnapshot.name();
  }
});
