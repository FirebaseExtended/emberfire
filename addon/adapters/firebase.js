import Ember from 'ember';
import DS from 'ember-data';
import Waitable from '../mixins/waitable';
import toPromise from '../utils/to-promise';
import forEach from 'lodash/collection/forEach';
import find from 'lodash/collection/find';

var Promise = Ember.RSVP.Promise;


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

    var firebase = this.get('firebase');
    if (!firebase || typeof firebase !== 'object') {
      throw new Error('Please set the `firebase` property on the adapter.');
    }
    // If provided Firebase reference was a query (eg: limits), make it a ref.
    this._ref = firebase.ref();
    // Keep track of what types `.findAll()` has been called for
    this._findAllMapForType = {};
    // Used to batch records into the store
    this._queue = [];
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
      if (payload === null) {
        var error = new Error(`no record was found at ${ref.toString()}`);
            error.recordId = id;
        throw error;
      }

      return payload;
    });
  },


  /**
   * Promise interface for once('value') that also handle test waiters.
   *
   * @param  {Firebase} ref
   * @param  {String} log
   * @return {Promise<DataSnapshot>}
   * @private
   */
  _fetch(ref, log) {
    this._incrementWaiters();
    return new Promise((resolve, reject) => {

      ref.once('value', (snapshot) => {
        this._decrementWaiters();
        Ember.run(null, resolve, snapshot);

      }, (err) => {
        this._decrementWaiters();
        Ember.run(null, reject, err);
      });

    }, log);
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
          this._removeHasManyRecord(store, parentRef, inverseKey.name, record.id);
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
      var record = store.peekRecord(modelName, snapshot.key());

      if (!record || !record.__listening) {
        var payload = this._assignIdToPayload(snapshot);
        var normalizedData = store.normalize(typeClass.modelName, payload);
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
      var record = store.peekRecord(modelName, snapshot.key());
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

    ['limitToFirst', 'limitToLast', 'startAt', 'endAt', 'equalTo'].forEach(function (key) {
      if (query[key] || query[key] === '' || query[key] === false) {
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
      var payload = this._assignIdToPayload(snapshot);

      this._enqueue(function FirebaseAdapter$enqueueStorePush() {
        if (!store.isDestroying) {
          var normalizedData = store.normalize(typeClass.modelName, payload);
          store.push(normalizedData);
        }
      });
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
   * Modified serialized record to use multipath update so that relationships get
   * update correctly
   */
  _recurseGenerateMultiPathUpdate(serializedRecord) {
    for (var key in serializedRecord) {
      if (serializedRecord.hasOwnProperty(key)) {
        var data = serializedRecord[key];
        if (!Ember.isNone(data) && (typeof data === "object")) {
          for (var prop in data) {
            var sub = key + '/' + prop;
            this._recurseGenerateMultiPathUpdate(data[prop]);
            serializedRecord[sub] = data[prop];
          }
          delete serializedRecord[key];
        }
      } else {
        delete serializedRecord[key];
      }
    }
  },

  /**
   * Called by the store when a record is created/updated via the `save`
   * method on a model record instance.
   *
   * The `updateRecord` method serializes the record and performs an `update()`
   * at the the Firebase location.
   *
   * We take an optional record reference, in order for this method to be usable
   * for saving nested records as well.
   */
  updateRecord(store, typeClass, snapshot) {
    var recordRef = this._getAbsoluteRef(snapshot.record);

    var pathPieces = recordRef.path.toString().split('/');
    var lastPiece = pathPieces[pathPieces.length-1];
    var serializedRecord = snapshot.serialize({
      includeId: (lastPiece !== snapshot.id) // record has no firebase `key` in path
    });
    console.log("BEFORE ======> ");
    console.log(serializedRecord);
    this._recurseGenerateMultiPathUpdate(serializedRecord);
    console.log("AFTER ======> ");
    console.log(serializedRecord);
    return this._updateRecord(recordRef, serializedRecord).then(() => {
      return this._cleanEmbeddedChildren(store, typeClass, snapshot);
    }).then(() => {
      // required, tells ember data that the data we saved is the last known
      // server state. Equivalent is to return `serializedRecord`.
      return undefined;
    });

    // TODO: add promise label:
    // `DS: FirebaseAdapter#updateRecord ${typeClass} to ${recordRef.toString()}`);
  },

  /**
   * Recursively removes the `dirty` state on all embedded children.
   *
   * @param  {DS.Store} store
   * @param  {Class} typeClass
   * @param  {DS.Snapshot} snapshot
   * @private
   */
  _cleanEmbeddedChildren: function (store, typeClass, snapshot) {
    var embeddedSnapshots = [];
    snapshot.eachRelationship((key, relationship) => {
      if (this.isRelationshipEmbedded(store, typeClass.modelName, relationship)) {
        if (relationship.kind === 'hasMany') {
          snapshot.hasMany(key).forEach(function (childSnapshot) {
            embeddedSnapshots.push(childSnapshot);
          });
        } else {
          if (snapshot.belongsTo(key)) {
            embeddedSnapshots.push(snapshot.belongsTo(key));
          }
        }
      }
    });

    embeddedSnapshots.forEach((childSnapshot) => {
      this._cleanEmbeddedChildren(store, childSnapshot.type, childSnapshot);
      childSnapshot._internalModel.flushChangedAttributes();
      childSnapshot._internalModel.adapterWillCommit();
      childSnapshot._internalModel.adapterDidCommit();
    });
  },


  /**
   * Update a single record without caring for the relationships
   * @param  {Firebase} recordRef
   * @param  {Object} serializedRecord
   * @return {Promise}
   */
  _updateRecord(recordRef, serializedRecord) {
    return toPromise(recordRef.update, recordRef, [serializedRecord]);
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
  _removeHasManyRecord(store, parentRef, key, id) {
    var ref = this._getRelationshipRef(parentRef, key, id);
    return toPromise(ref.remove, ref, [], ref.toString());
  },


  /**
   * Called by the store when a record is deleted.
   */
  deleteRecord(store, typeClass, snapshot) {
    var ref = this._getAbsoluteRef(snapshot.record);
    return toPromise(ref.remove, ref);
  },


  /**
   * Determines a path fo a given type
   */
  pathForType(modelName) {
    var camelized = Ember.String.camelize(modelName);
    return Ember.String.pluralize(camelized);
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
      var recordRef = this._getAbsoluteRef(parent).child(relationship.key);

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
    var embeddingParentRel = find(internalModel._implicitRelationships, (implicitRel) => {
      var members = implicitRel.members.toArray();
      var parent = members[0];

      if (!parent) {
        return false;
      }

      var parentRel = parent._relationships.get(implicitRel.inverseKey);
      return this.isRelationshipEmbedded(this.store, parent.type.modelName, parentRel.relationshipMeta);
    });

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
   * Called after the first item is pushed into the _queue
   */
  _queueScheduleFlush() {
    Ember.run.later(this, this._queueFlush, this._queueFlushDelay);
  },


  /**
   * Call each function in the _queue and the reset the _queue
   */
  _queueFlush() {
    forEach(this._queue, function FirebaseAdapter$flushQueueItem(queueItem) {
      var fn = queueItem[0];
      var args = queueItem[1];
      fn.apply(null, args);
    });
    this._queue.length = 0;
  },


  /**
   * Push a new function into the _queue and then schedule a
   * flush if the item is the first to be pushed
   */
  _enqueue(callback, args) {
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
   * A utility for retrieving the key name of a Firebase ref or
   * DataSnapshot. This is backwards-compatible with `name()`
   * from Firebase 1.x.x and `key()` from Firebase 2.0.0+. Once
   * support for Firebase 1.x.x is dropped in EmberFire, this
   * helper can be removed.
   */
  _getKey(refOrSnapshot) {
    return (typeof refOrSnapshot.key === 'function') ? refOrSnapshot.key() : refOrSnapshot.name();
  },


  /**
   * We don't need background reloading, because firebase!
   */
  shouldBackgroundReloadRecord() {
    return false;
  }
});
