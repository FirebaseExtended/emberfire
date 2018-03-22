import Ember from 'ember';
import DS from 'ember-data';
import Waitable from '../mixins/waitable';
import toPromise from '../utils/to-promise';

const { assign, RSVP } = Ember;
const { Promise } = RSVP;

import { pluralize } from 'ember-inflector';

var uniq = function (arr) {
  var ret = Ember.A();

  arr.forEach(function(k) {
    if (ret.indexOf(k) < 0) {
      ret.push(k);
    }
  });

  return ret;
};

var isInteger = Number.isInteger || function(value) {
  return typeof value === 'number' &&
    isFinite(value) &&
    Math.floor(value) === value;
};

/**
 * The Firebase adapter allows your store to communicate with the Firebase
 * realtime service. To use the adapter in your app, extend DS.FirebaseAdapter
 * and customize the endpoint to point to the Firebase URL where you want this
 * data to be stored.
 *
 * The adapter will automatically communicate with Firebase to persist your
 * records as neccessary. Importantly, the adapter will also update the store
 * in realtime when changes are made to the Firebase by other clients or
 * otherwise.
 */
export default DS.Adapter.extend(Waitable, {
  firebase: Ember.inject.service(),
  store: Ember.inject.service(),
  defaultSerializer: '-firebase',


  /**
   * Endpoint paths can be customized by setting the Firebase property on the
   * adapter:
   *
   * ```js
   * DS.FirebaseAdapter.extend({
   *   firebase: new Firebase('https://<my-firebase>.firebaseio.com/')
   * });
   * ```
   *
   * Requests for `App.Post` now target `https://<my-firebase>.firebaseio.com/posts`.
   *
   * @property firebase
   * @type {Firebase}
   * @constructor
   */
  init() {
    this._super.apply(this, arguments);

    var ref = this.get('firebase');
    if (!ref) {
      throw new Error('Please set the `firebase` property in the environment config.');
    }
    // If provided Firebase reference was a query (eg: limits), make it a ref.
    this._ref = ref;
    // Keep track of what types `.findAll()` has been called for
    this._findAllMapForType = {};
    // Keep a cache to check modified relationships against
    this._recordCacheForType = {};
    // Used to batch records into the store
    this._queue = [];
    // Payloads to push later
    this._queuedPayloads = {};
  },


  /**
   * Uses push() to generate chronologically ordered unique IDs.
   *
   * @return {String}
   */
  generateIdForRecord() {
    return this._getKey(this._ref.push());
  },


  /**
   * Use the Firebase DataSnapshot's key as the record id
   *
   * @param {Object} snapshot - A Firebase snapshot
   * @param {Object} payload - The payload that will be pushed into the store
   * @return {Object} payload
   */
  _assignIdToPayload(snapshot) {
    var payload = snapshot.val();
    if (payload !== null && typeof payload === 'object' && typeof payload.id === 'undefined') {
      payload.id = this._getKey(snapshot);
    }
    return payload;
  },


  /**
   * Called by the store to retrieve the JSON for a given type and ID. The
   * method will return a promise which will resolve when the value is
   * successfully fetched from Firebase.
   *
   * Additionally, from this point on, the object's value in the store will
   * also be automatically updated whenever the remote value changes.
   */
  findRecord(store, typeClass, id) {
    var ref = this._getCollectionRef(typeClass, id);

    var log = `DS: FirebaseAdapter#findRecord ${typeClass.modelName} to ${ref.toString()}`;

    return this._fetch(ref, log).then((snapshot) => {
      var payload = this._assignIdToPayload(snapshot);
      this._updateRecordCacheForType(typeClass, payload, store);
      if (payload === null) {
        var error = new Error(`no record was found at ${ref.toString()}`);
            error.recordId = id;
        throw error;
      }

      return payload;
    });
  },


  /**
   * Promise interface for once('value').
   *
   * @param  {Firebase} ref
   * @param  {String} log
   * @return {Promise<DataSnapshot>}
   * @private
   */
  _fetch(ref, log) {
    return RSVP.resolve(ref.once('value'), log);
  },


  recordWasPushed(store, modelName, record) {
    if (!record.__listening) {
      var typeClass = store.modelFor(modelName);
      this.listenForChanges(store, typeClass, record);
    }
  },


  recordWillUnload(store, record) {
    if (record.__listening) {
      this.stopListening(store, record.constructor, record);
    }
  },


  recordWillDelete(store, record) {
    record.eachRelationship((key, relationship) => {
      if (relationship.kind === 'belongsTo') {
        var parentRecord = record.get(relationship.key);
        var inverseKey = record.inverseFor(relationship.key);
        if (inverseKey && parentRecord.get('id')) {
          var parentRef = this._getCollectionRef(inverseKey.type, parentRecord.get('id'));
          this._removeHasManyRecord(store, parentRef, inverseKey.name, record.constructor, record.id);
        }
      }
    });
  },


  listenForChanges(store, typeClass, record) {
    // embedded records will get their changes from parent listeners
    if (!this.isRecordEmbedded(record)) {
      record.__listening = true;
      var ref = this._getCollectionRef(typeClass, record.id);
      var called = false;
      ref.on('value', (snapshot) => {
        if (called) {
          Ember.run(() => {
            this._handleChildValue(store, typeClass, snapshot);
          });
        }
        called = true;
      }, (error) => {
        Ember.Logger.error(error);
      });
    }
  },


  stopListening(store, typeClass, record) {
    if (record.__listening) {
      var ref = this._getCollectionRef(typeClass, record.id);
      ref.off('value');
      record.__listening = false;
    }
  },


  /**
   * Called by the store to retrieve the JSON for all of the records for a
   * given type. The method will return a promise which will resolve when the
   * value is successfully fetched from Firebase.
   *
   * Additionally, from this point on, any records of this type that are added,
   * removed or modified from Firebase will automatically be reflected in the
   * store.
   */
  findAll(store, typeClass) {
    var ref = this._getCollectionRef(typeClass);

    var log = `DS: FirebaseAdapter#findAll ${typeClass.modelName} to ${ref.toString()}`;

    return this._fetch(ref, log).then((snapshot) => {
      if (!this._findAllHasEventsForType(typeClass)) {
        this._findAllAddEventListeners(store, typeClass, ref);
      }
      var results = [];
      snapshot.forEach((childSnapshot) => {
        var payload = this._assignIdToPayload(childSnapshot);
        this._updateRecordCacheForType(typeClass, payload, store);
        results.push(payload);
      });

      return results;
    });
  },


  query(store, typeClass, query, recordArray) {
    var ref = this._getCollectionRef(typeClass);
    var modelName = typeClass.modelName;

    ref = this.applyQueryToRef(ref, query);

    ref.on('child_added', Ember.run.bind(this, function (snapshot) {
      var record = store.peekRecord(modelName, this._getKey(snapshot));

      if (!record || !record.__listening) {
        var payload = this._assignIdToPayload(snapshot);
        var normalizedData = store.normalize(typeClass.modelName, payload);
        this._updateRecordCacheForType(typeClass, payload, store);
        record = store.push(normalizedData);
      }

      if (record) {
        recordArray.get('content').addObject(record._internalModel);
      }
    }));

    // `child_changed` is already handled by the record's
    // value listener after a store.push. `child_moved` is
    // a much less common case because it relates to priority

    ref.on('child_removed', Ember.run.bind(this, function (snapshot) {
      var record = store.peekRecord(modelName, this._getKey(snapshot));
      if (record) {
        recordArray.get('content').removeObject(record._internalModel);
      }
    }));

    // clean up event handlers when the array is being destroyed
    // so that future firebase events wont keep trying to use a
    // destroyed store/serializer
    recordArray.__firebaseCleanup = function () {
      ref.off('child_added');
      ref.off('child_removed');
    };

    var log = `DS: FirebaseAdapter#query ${modelName} with ${query}`;

    return this._fetch(ref, log).then((snapshot) => {
      if (!this._findAllHasEventsForType(typeClass)) {
        this._findAllAddEventListeners(store, typeClass, ref);
      }
      var results = [];
      snapshot.forEach((childSnapshot) => {
        var payload = this._assignIdToPayload(childSnapshot);
        this._updateRecordCacheForType(typeClass, payload, store);
        results.push(payload);
      });
      return results;
    });
  },


  applyQueryToRef(ref, query) {

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

    ref = this._applyRangesToRef(ref, query);
    ref = this._applyLimitsToRef(ref, query);

    return ref;
  },

  _applyRangesToRef(ref, query) {
    const methods = ['equalTo', 'startAt', 'endAt'];
    methods.forEach(key => {
      if (query[key] !== undefined) {
        ref = ref[key](query[key]);
      }
    });

    return ref;
  },

  _applyLimitsToRef(ref, query) {
    const methods = ['limitToFirst', 'limitToLast'];
    methods.forEach(key => {
      if (isInteger(query[key])) {
        ref = ref[key](query[key]);
      }
    });

    return ref;
  },


  /**
   * Keep track of what types `.findAll()` has been called for
   * so duplicate listeners aren't added
   */
  _findAllMapForType: undefined,


  /**
   * Determine if the current type is already listening for children events
   */
  _findAllHasEventsForType(typeClass) {
    return !Ember.isNone(this._findAllMapForType[typeClass.modelName]);
  },


  /**
   * After `.findAll()` is called on a modelName, continue to listen for
   * `child_added`, `child_removed`, and `child_changed`
   */
  _findAllAddEventListeners(store, typeClass, ref) {
    var modelName = typeClass.modelName;
    this._findAllMapForType[modelName] = true;

    ref.on('child_added', Ember.run.bind(this, function (snapshot) {
      if (!store.hasRecordForId(modelName, this._getKey(snapshot))) {
        this._handleChildValue(store, typeClass, snapshot);
      }
    }));
  },


  /**
   * Push a new child record into the store
   */
  _handleChildValue(store, typeClass, snapshot) {
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
      const payload = this._assignIdToPayload(snapshot);
      this._pushLater(typeClass.modelName, payload.id, payload);
    }
  },


  /**
   * `createRecord` is an alias for `updateRecord` because calling \
   * `ref.set()` would wipe out any existing relationships
   */
  createRecord(store, typeClass, snapshot) {
    return this.updateRecord(store, typeClass, snapshot).then(() => {
      this.listenForChanges(store, typeClass, snapshot.record);
    });
  },


  /**
   * Called by the store when a record is created/updated via the `save`
   * method on a model record instance.
   *
   * The `updateRecord` method serializes the record and performs an `update()`
   * at the the Firebase location and a `.set()` at any relationship locations
   * The method will return a promise which will be resolved when the data and
   * any relationships have been successfully saved to Firebase.
   *
   * We take an optional record reference, in order for this method to be usable
   * for saving nested records as well.
   */
  updateRecord(store, typeClass, snapshot) {
    var recordRef = this._getAbsoluteRef(snapshot.record);
    var recordCache = this._getRecordCache(typeClass, snapshot.id);
    var pathPieces = recordRef.path.toString().split('/');
    var lastPiece = pathPieces[pathPieces.length-1];
    var serializedRecord = snapshot.serialize({
      includeId: (lastPiece !== snapshot.id) // record has no firebase `key` in path
    });
    const serializer = store.serializerFor(typeClass.modelName);

    return new Promise((resolve, reject) => {
      var relationshipsToSave = [];
      // first we remove all relationships data from the serialized record, we backup the
      // removed data so that we can save it at a later stage.
      snapshot.record.eachRelationship((key, relationship) => {
      const relationshipKey = serializer.keyForRelationship(key);
      const data = serializedRecord[relationshipKey];
      const isEmbedded = this.isRelationshipEmbedded(store, typeClass.modelName, relationship);
      const hasMany = relationship.kind === 'hasMany';
      if (hasMany || isEmbedded) {
          if (!Ember.isNone(data)) {
            relationshipsToSave.push({
              data:data,
              relationship:relationship,
              isEmbedded:isEmbedded,
              hasMany:hasMany
            });
          }
          delete serializedRecord[relationshipKey];
        }
      });
      var reportError = (errors) => {
        var error = new Error(`Some errors were encountered while saving ${typeClass} ${snapshot.id}`);
        error.errors = errors;
        reject(error);
      };
      this._updateRecord(recordRef, serializedRecord).then(() => {
        // and now we construct the list of promise to save relationships.
        var savedRelationships = relationshipsToSave.map((relationshipToSave) => {
            const data = relationshipToSave.data;
            const relationship = relationshipToSave.relationship;
            if (relationshipToSave.hasMany) {
              return this._saveHasManyRelationship(store, typeClass, relationship, data, recordRef, recordCache);
            } else {
              // embedded belongsTo, we need to fill in the informations.
              if (relationshipToSave.isEmbedded) {
                return this._saveEmbeddedBelongsToRecord(store, typeClass, relationship, data, recordRef);
              }
            }
          }
        );
        return Ember.RSVP.allSettled(savedRelationships);
      }).catch((e) => {
        reportError([e]);
      }).then((results) => {
        var rejected = Ember.A(results).filterBy('state', 'rejected');
        if (rejected.length !== 0) {
          reportError(rejected.mapBy('reason').toArray());
        } else {
          resolve();
        }
      });
    }, `DS: FirebaseAdapter#updateRecord ${typeClass} to ${recordRef.toString()}`);
  },


  /**
   * Update a single record without caring for the relationships
   * @param  {Firebase} recordRef
   * @param  {Object} serializedRecord
   * @return {Promise}
   */
  _updateRecord(recordRef, serializedRecord) {
    this._incrementWaiters();
    return toPromise(recordRef.update, recordRef, [serializedRecord])
      .then((result) => {
        this._decrementWaiters();
        return result;
      })
      .catch((e) => {
        this._decrementWaiters();
        return Ember.RSVP.reject(e);
      });
  },


  /**
   * Call _saveHasManyRelationshipRecord on each record in the relationship
   * and then resolve once they have all settled
   */
  _saveHasManyRelationship(store, typeClass, relationship, ids, recordRef, recordCache) {
    if (!Ember.isArray(ids)) {
      throw new Error('hasMany relationships must must be an array');
    }
    var idsCache = Ember.A(recordCache[relationship.key]);
    var dirtyRecords = [];

    // Added
    var addedRecords = ids.filter((id) => {
      return !idsCache.includes(id);
    });

    // Dirty
    dirtyRecords = ids.filter((id) => {
      var relatedModelName = relationship.type;
      return store.hasRecordForId(relatedModelName, id) && store.peekRecord(relatedModelName, id).get('hasDirtyAttributes') === true;
    });

    dirtyRecords = uniq(dirtyRecords.concat(addedRecords)).map((id) => {
      return this._saveHasManyRecord(store, typeClass, relationship, recordRef, id);
    });

    // Removed
    var removedRecords = idsCache.filter((id) => {
      return !ids.includes(id);
    });

    removedRecords = removedRecords.map((id) => {
      return this._removeHasManyRecord(store, recordRef, relationship.key, typeClass, id);
    });
    // Combine all the saved records
    var savedRecords = dirtyRecords.concat(removedRecords);
    // Wait for all the updates to finish
    return Ember.RSVP.allSettled(savedRecords).then((savedRecords) => {
      var rejected = Ember.A(Ember.A(savedRecords).filterBy('state', 'rejected'));
      if (rejected.get('length') === 0) {
        // Update the cache
        recordCache[relationship.key] = ids;
        return savedRecords;
      }
      else {
        var error = new Error(`Some errors were encountered while saving a hasMany relationship ${relationship.parentType} -> ${relationship.type}`);
            error.errors = Ember.A(rejected).mapBy('reason');
        throw error;
      }
    });
  },


  /**
   * If the relationship is `async: true`, create a child ref
   * named with the record id and set the value to true

   * If the relationship is `embedded: true`, create a child ref
   * named with the record id and update the value to the serialized
   * version of the record
   */
  _saveHasManyRecord(store, typeClass, relationship, parentRef, id) {
    const serializer = store.serializerFor(typeClass.modelName);
    var ref = this._getRelationshipRef(parentRef, serializer.keyForRelationship(relationship.key), id);
    var record = store.peekRecord(relationship.type, id);
    var isEmbedded = this.isRelationshipEmbedded(store, typeClass.modelName, relationship);
    if (isEmbedded) {
      return record.save();
    }

    return toPromise(ref.set, ref,  [true]);
  },


  /**
   * Determine from the serializer if the relationship is embedded via the
   * serializer's `attrs` hash.
   *
   * @return {Boolean}              Is the relationship embedded?
   */
  isRelationshipEmbedded(store, modelName, relationship) {
    var serializer = store.serializerFor(modelName);
    return serializer.hasDeserializeRecordsOption(relationship.key);
  },


  /**
   * Determine from if the record is embedded via implicit relationships.
   *
   * @return {Boolean}              Is the relationship embedded?
   */
  isRecordEmbedded(record) {
    if (record._internalModel) {
      record = record._internalModel;
    }

    var found = this.getFirstEmbeddingParent(record);

    return !!found;
  },


  /**
   * Remove a relationship
   */
  _removeHasManyRecord(store, parentRef, key, typeClass, id) {
    const relationshipKey = store.serializerFor(typeClass.modelName).keyForRelationship(key);
    var ref = this._getRelationshipRef(parentRef, relationshipKey, id);
    return toPromise(ref.remove, ref, [], ref.toString());
  },


  /**
   * Save an embedded belongsTo record and set its internal firebase ref
   *
   * @return {Promise<DS.Model>}
   */
  _saveEmbeddedBelongsToRecord(store, typeClass, relationship, id, parentRef) {
    var record = store.peekRecord(relationship.type, id);
    if (record) {
      return record.save();
    }
    return Ember.RSVP.Promise.reject(new Error(`Unable to find record with id ${id} from embedded relationship: ${JSON.stringify(relationship)}`));
  },


  /**
   * Called by the store when a record is deleted.
   */
  deleteRecord(store, typeClass, snapshot) {
    var ref = this._getAbsoluteRef(snapshot.record);
    ref.off('value');
    return toPromise(ref.remove, ref);
  },


  /**
   * Determines a path fo a given type
   */
  pathForType(modelName) {
    var camelized = Ember.String.camelize(modelName);
    return pluralize(camelized);
  },


  /**
   * Return a Firebase reference for a given modelName and optional ID.
   */
  _getCollectionRef(typeClass, id) {
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
   * Returns a Firebase reference for a record taking into account if the record is embedded
   *
   * @param  {DS.Model} record
   * @return {Firebase}
   */
  _getAbsoluteRef(record) {
    if (record._internalModel) {
      record = record._internalModel;
    }

    var embeddingParent = this.getFirstEmbeddingParent(record);

    if (embeddingParent) {
      var { record: parent, relationship } = embeddingParent;
      const embeddedKey = parent.store.serializerFor(parent.modelName).keyForRelationship(relationship.key);
      var recordRef = this._getAbsoluteRef(parent).child(embeddedKey);

      if (relationship.kind === 'hasMany') {
        recordRef = recordRef.child(record.id);
      }
      return recordRef;
    }

    return this._getCollectionRef(record.type, record.id);
  },


  /**
   * Returns the parent record and relationship where any embedding is detected
   *
   * @param  {DS.InternalModel} internalModel
   * @return {Object}
   */
  getFirstEmbeddingParent(internalModel) {
    let relationships = assign(
      {},
      internalModel._implicitRelationships,
      internalModel._relationships.initializedRelationships
    );

    let embeddingParentRel;
    let relationshipKeys = Object.keys(relationships);

    for (let i = 0; i < relationshipKeys.length; i++) {
      let rel = relationships[relationshipKeys[i]];
      let members = rel.members.toArray();
      let parent = members[0];

      if (!parent || !rel.inverseKey) {
        continue;
      }

      let parentRel = parent._relationships.get(rel.inverseKey);
      if (this.isRelationshipEmbedded(this.store, parent.type.modelName, parentRel.relationshipMeta)) {
        embeddingParentRel = rel;
        break;
      }
    }

    if (embeddingParentRel) {
      var parent = embeddingParentRel.members.toArray()[0];
      var parentKey = embeddingParentRel.inverseKey;
      var parentRel = parent._relationships.get(parentKey).relationshipMeta;
      return { record: parent, relationship: parentRel };
    }
  },


  /**
   * Return a Firebase reference based on a relationship key and record id
   */
  _getRelationshipRef(ref, key, id) {
    return ref.child(key).child(id);
  },


  /**
   * The amount of time (ms) before the _queue is flushed
   */
  _queueFlushDelay: (1000/60), // 60fps


  /**
   * Schedules a `_flushQueue` for later.
   *
   * @private
   */
  _flushLater() {
    Ember.run.later(this, this._flushQueue, this._queueFlushDelay);
  },


  /**
   * Flush all delayed `store.push` payloads in `this._queuedPayloads`.
   *
   * @private
   */
  _flushQueue() {
    const store = this.get('store');
    if (store.isDestroying) {
      return;
    }

    this._queue.forEach((key) => {
      const { payload, modelName } = this._queuedPayloads[key];
      const normalizedData = store.normalize(modelName, payload);
      store.push(normalizedData);
    });
    this._queuedPayloads = {};
    this._queue.length = 0;
  },


  /**
   * Schedule a payload push for later. This will only push at most one payload
   * per record. When trying to push to the same record multiple times, only the
   * last push will be kept.
   *
   * @param {string} modelName
   * @param {string} id
   * @param {!Object<string, *>} payload
   * @private
   */
  _pushLater(modelName, id, payload) {
    const store = this.get('store');
    if (!this._queueFlushDelay) {
      const normalizedData = store.normalize(modelName, payload);
      store.push(normalizedData);
      return;
    }

    const key = `${modelName}-${id}`;
    if (this._queuedPayloads[key]) {
      // remove from original place in queue (will be added to end)
      const oldPosition = this._queue.indexOf(key);
      this._queue.splice(oldPosition, 1);
    }
    this._queuedPayloads[key] = { payload, modelName };
    this._queue.push(key);

    // if this is the first item to be queued, schedule a flush
    if (this._queue.length === 1) {
      this._flushLater();
    }
  },


  /**
   * A cache of hasMany relationships that can be used to
   * diff against new relationships when a model is saved
   */
  _recordCacheForType: undefined,


  /**
   * _updateHasManyCacheForType
   */
  _updateRecordCacheForType(typeClass, payload, store) {
    if (!payload) { return; }
    const id = payload.id;
    const cache = this._getRecordCache(typeClass, id);
    const serializer = store.serializerFor(typeClass.modelName);
    // Only cache relationships for now
    // and do the same for embedded records
    typeClass.eachRelationship((key, relationship) => {
      if (relationship.kind === 'hasMany') {
        const relationshipPayload = payload[serializer.keyForRelationship(key)];
        if (!relationshipPayload) {
          cache[key] = Ember.A();
        } else {
          const isEmbedded = this.isRelationshipEmbedded(store, typeClass.modelName, relationship);
          if (isEmbedded) {
            const relationshipTypeClass = store.modelFor(relationship.type);
            for (let id in relationshipPayload) {
              let obj = relationshipPayload[id];
              obj.id = id;
              this._updateRecordCacheForType(relationshipTypeClass, obj, store);
            }
          } else {
            const ids = Object.keys(relationshipPayload);
            cache[key] = Ember.A(ids);
          }
        }
      }
    });
  },


  /**
   * Get or create the cache for a record
   */
  _getRecordCache(typeClass, id) {
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
  _getKey(refOrSnapshot) {
    var key;
    if (typeof refOrSnapshot.key === 'function') {
      key = refOrSnapshot.key();
    } else if (typeof refOrSnapshot.key === 'string') {
      key = refOrSnapshot.key;
    } else {
      key = refOrSnapshot.name();
    }
    return key;
  },


  /**
   * We don't need background reloading, because firebase!
   */
  shouldBackgroundReloadRecord() {
    return false;
  }
});
