(function() {
  "use strict";

  /* Only enable if Ember Data is included */
  if (window.DS === undefined) {
    return;
  }

  /**
    The Firebase serializer helps normalize relationships and can be extended on
    a per model basis.
  */
  DS.FirebaseSerializer = DS.JSONSerializer.extend(Ember.Evented, {

    /**
      Called after `extractSingle()`. This method checks the model
      for `hasMany` relationships and makes sure the value is an object.
      The object is then converted to an Array using `Ember.keys`
    */
    normalize: function(type, hash) {
      // Check if the model contains any 'hasMany' relationships
      type.eachRelationship(function(key, relationship) {
        if (relationship.kind === 'hasMany') {
          if (typeof hash[key] === 'object' && !Ember.isArray(hash[key]) && relationship.options.embedded !== true) {
            hash[key] = Ember.keys(hash[key]);
          }
          else if (Ember.isArray(hash[key])) {
            throw new Error('%@ relationship %@(\'%@\') must be a key/value map in Firebase. Example: { "%@": { "%@_id": true } }'.fmt(type.toString(), relationship.kind, relationship.type.typeKey, relationship.key, relationship.type.typeKey));
          }
        }
      });
      return this._super.apply(this, arguments);
    },

    /**
      extractSingle
    */
    extractSingle: function(store, type, payload) {
      var normalizedPayload = this.normalize(type, payload);
      // Check for embedded records
      type.eachRelationship(function(key, relationship) {
        if (!Ember.isNone(payload[key]) && relationship.options.embedded === true) {
          var embeddedKey;
          var embeddedRecordPayload = normalizedPayload[key];
          var records = [];
          var record;
          for (embeddedKey in embeddedRecordPayload) {
            record = embeddedRecordPayload[embeddedKey];
            if (record !== null && typeof record === 'object') {
              record.id = embeddedKey;
            }
            records.push(record);
          }
          normalizedPayload[key] = Ember.keys(normalizedPayload[key]);
          store.pushMany(relationship.type, records);
        }
      });
      return normalizedPayload;
    },

    /**
      Called after the adpter runs `findAll()` or `findMany()`. This method runs
      `extractSingle()` on each item in the payload and as a result each item
      will have `normalize()` called on it
    */
    extractArray: function(store, type, payload) {
      return payload.map(function(item) {
        return this.extractSingle(store, type, item);
      }, this);
    }

  });

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
  DS.FirebaseAdapter = DS.Adapter.extend(Ember.Evented, {

    defaultSerializer: '-firebase',

    /**
      Endpoint paths can be customized by setting the Firebase property on the
      adapter:

      ```js
      DS.FirebaseAdapter.extend({
        firebase: new Firebase('https://<my-firebase>.firebaseio.com/')
      });
      ```

      Requests for `App.Post` would now target `https://<my-firebase>.firebaseio.com/posts`.

      @property firebase
      @type {Firebase}
    */

    init: function() {
      if (!this.firebase || typeof this.firebase !== 'object') {
        throw new Error('Please set the `firebase` property on the adapter.');
      }
      // If provided Firebase reference was a query (eg: limits), make it a ref.
      this._ref = this.firebase.ref();
      // Keep track of what types `.findAll()` has been called for
      this._findAllMapForType = {};
      // Used to batch records into the store
      this._queue = [];
    },

    // Uses push() to generate chronologically ordered unique IDs.
    generateIdForRecord: function() {
      return this._ref.push().name();
    },

    /**
      Called by the store to retrieve the JSON for a given type and ID. The
      method will return a promise which will resolve when the value is
      successfully fetched from Firebase.

      Additionally, from this point on, the object's value in the store will
      also be automatically updated whenever the remote value changes.
    */
    find: function(store, type, id) {
      var _this = this;
      var resolved = false;
      var ref = this._getRef(type, id);
      var serializer = store.serializerFor(type);

      return new Ember.RSVP.Promise(function(resolve, reject) {
        ref.on('value', function(snapshot) {
          var obj = snapshot.val();
          // Set id to the snapshot name
          if (obj !== null && typeof obj === 'object') {
            obj.id = snapshot.name();
          }
          if (!resolved) {
            resolved = true;
            // If this is the first event, resolve the promise.
            if (obj === null) {
              _this._queuePush(reject);
            }
            else {
              _this._queuePush(resolve, [obj]);
            }
          } else {
            // If the snapshot is null, delete the record from the store
            if (obj === null && store.hasRecordForId(type, snapshot.name())) {
              _this._queuePush(function() {
                store.getById(type, snapshot.name()).destroyRecord();
              });
            }
            // Otherwise push it into the store
            else {
              _this._queuePush(function() {
                store.push(type, serializer.extractSingle(store, type, obj));
              });
            }
          }
        },
        function(err) {
          // Only called in cases of permission related errors.
          if (!resolved) {
            _this._queuePush(reject, [err]);
          }
        });
      }, 'DS: FirebaseAdapter#find ' + type + ' to ' + ref.toString());
    },

    /**
      Called by the store to retrieve the JSON for all of the records for a
      given type. The method will return a promise which will resolve when the
      value is successfully fetched from Firebase.

      Additionally, from this point on, any records of this type that are added,
      removed or modified from Firebase will automatically be reflected in the
      store.
    */
    findAll: function(store, type) {
      var _this = this;
      var resolved = false;
      var ref = this._getRef(type);
      var serializer = store.serializerFor(type);

      return new Ember.RSVP.Promise(function(resolve, reject) {
        var _handleError = function(err) {
          if (!resolved) {
            resolved = true;
            _this._queuePush(reject, [err]);
          }
        };

        var _addListeners = function() {
          var hasEvents = !Ember.isNone(_this._findAllMapForType[type]);
          if (hasEvents) { return; }
          _this._findAllMapForType[type] = true;
          ref.on('child_added', function(snapshot) {
            _this._handleChildValue(store, type, serializer, snapshot);
          }, _handleError);
          ref.on('child_changed', function(snapshot) {
            _this._handleChildValue(store, type, serializer, snapshot);
          }, _handleError);
          ref.on('child_removed', function(snapshot) {
            if (store.hasRecordForId(type, snapshot.name())) {
              this._queuePush(function() {
                store.deleteRecord(store.getById(type, snapshot.name()));
              });
            }
          }, _handleError);
        };

        ref.once('value', function(snapshot) {
          resolved = true;
          var results = [];
          snapshot.forEach(function(childSnapshot) {
            var obj = childSnapshot.val();
            if (obj !== null && typeof obj === 'object') {
              obj.id = childSnapshot.name();
            }
            results.push(obj);
          });
          _this._queuePush(resolve, [results]);
          _addListeners();
        });
      }, 'DS: FirebaseAdapter#findAll ' + type + ' to ' + ref.toString());
    },

    /**
      `createRecord` is the same as `updateRecord` because calling `ref.set()`
      would wipe out any relationships that may have been added
    */
    createRecord: function(store, type, record) {
      return this.updateRecord(store, type, record);
    },

    /**
      Called by the store when a record is created/updated via the `save`
      method on a model record instance.

      The `updateRecord` method serializes the record and performs an `update()`
      at the the Firebase location and a `.set()` at any relationship locations
      The method will return a promise which will be resolved when the data has
      been successfully saved to Firebase.
    */
    updateRecord: function(store, type, record) {
      var _this = this;
      var serializedRecord = record.serialize({
        includeId: false
      });
      var recordRef = this._getRef(type, record.id);

      return new Ember.RSVP.Promise(function(resolve, reject) {
        var savedRelationships = [];
        record.eachRelationship(function(key, relationship) {
          switch (relationship.kind) {
            case 'hasMany':
              if (Ember.isArray(serializedRecord[key])) {
                var save = _this._saveHasManyRelationship(store, relationship, serializedRecord[key] ,recordRef);
                savedRelationships.push(save);
                // Remove the relationship from the serializedRecord
                delete serializedRecord[key];
              }
              break;
            default:
              break;
          }
          // Save the record once all the relationships have saved
          return Ember.RSVP.allSettled(savedRelationships).then(function() {
            return new Ember.RSVP.Promise(function(resolve, reject) {
              recordRef.update(serializedRecord, function(error) {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            });
          });
        });
      }, 'DS: FirebaseAdapter#updateRecord %@ to %@'.fmt(type, recordRef.toString()));
    },

    // Called by the store when a record is deleted.
    deleteRecord: function(store, type, record) {
      var _this = this;
      var ref = this._getRef(type, record.id);

      return new Ember.RSVP.Promise(function(resolve, reject) {
        ref.remove(function(err) {
          if (err) {
            _this._queuePush(reject, [err]);
          } else {
            _this._queuePush(resolve);
          }
        });
      }, 'DS: FirebaseAdapter#deleteRecord ' + type + ' to ' + ref.toString());
    },

    /**
      Determines a path fo a given type
    */
    pathForType: function(type) {
      var camelized = Ember.String.camelize(type);
      return Ember.String.pluralize(camelized);
    },

    /**
      Returns a Firebase reference for a given type and optional ID.

      By default, it pluralizes the type's name ('post' becomes 'posts'). To
      override the pluralization, see [pathForType](#method_pathForType).

      @method _getRef
      @private
      @param {String} type
      @param {String} id
      @returns {Firebase} ref
    */
    _getRef: function(type, id) {
      var ref = this._ref;
      if (type) {
        ref = ref.child(this.pathForType(type.typeKey));
      }
      if (id) {
        ref = ref.child(id);
      }
      return ref;
    },

    /**
      Return a Firebase ref based on a relationship key and record id
    */
    _getRelationshipRef: function(ref, key, id) {
      return ref.child(key).child(id);
    },

    /**
      _queueScheduleFlush
    */
    _queueScheduleFlush: function() {
      var _this = this;
      setTimeout(function() {
        _this._queueFlush();
      }, 50);
    },

    /**
      _queueFlush
    */
    _queueFlush: function() {
      var _this = this;
      Ember.run(function() {
        console.log('FLUSH');
        _this._queue.forEach(function(queueItem) {
          var fn = queueItem[0];
          var args = queueItem[1];
          fn.apply(null, args);
        });
        _this._queue = [];
      });
    },

    /**
      _queuePush
    */
    _queuePush: function(callback, args) {
      var length = this._queue.push([callback, args]);
      if (length === 1) {
        this._queueScheduleFlush();
      }
    },

    /**
      _saveHasManyRelationship
    */
    _saveHasManyRelationship: function(store, relationship, ids, parentRef) {
      if (!Ember.isArray(ids)) {
        throw new Error('hasMany relationships must must be an array');
      }
      // Save each record in the relationship
      var savedRecords = ids.map(function(id) {
        return this._saveHasManyRelationshipRecord(store, relationship, parentRef, id);
      }, this);
      // Wait for all the updates to finish
      return Ember.RSVP.allSettled(savedRecords).then(function(savedRecords) {
        var rejected = savedRecords.filterBy('state', 'rejected');
        if (rejected.get('length') === 0) {
          return savedRecords;
        }
        else {
          return Ember.RSVP.reject({
            message: 'Some errors were encountered while saving %@ relationship'.fmt(relationship.type),
            errors: rejected.mapBy('reason')
          });
        }
      });
    },

    /**
      _saveHasManyRelationshipRecord
    */
    _saveHasManyRelationshipRecord: function(store, relationship, parentRef, id) {
      // Create a reference to the related record
      var ref = this._getRelationshipRef(parentRef, relationship.key, id);
      // Get the local version of the related record
      var relatedRecord = store.hasRecordForId(relationship.type, id) ? store.getById(relationship.type, id) : false;
      return new Ember.RSVP.Promise(function(resolve, reject) {
        var isEmbedded = relationship.options.embedded === true;
        var isDirty = relatedRecord ? relatedRecord.get('isDirty') : false;
        var valueToSave = isEmbedded ? relatedRecord.serialize({ includeId: false }) : true;
        // If the relationship is embedded and a record was found and the and there are changes
        // If the relationship is embedded and a related record was found and its dirty or there is no related record
        if ((isEmbedded && relatedRecord && isDirty) || (!isEmbedded && ((relatedRecord && isDirty) || !relatedRecord))) {
          var _saveHandler = function(error) {
            if (error) {
              if (typeof error === 'object') {
                error.location = ref.toString();
              }
              reject(error);
            } else {
              resolve();
            }
          };
          if (isEmbedded) {
            ref.update(valueToSave, _saveHandler);
          }
          else {
            ref.set(valueToSave, _saveHandler);
          }
        }
      });
    },

    /**
      Push a new child record into the store

      @method _handleChildValue
      @private
      @param {Object} store
      @param {Object} type
      @param {Object} serializer
      @param {Object} snapshot
    */
    _handleChildValue: function(store, type, serializer, snapshot) {
      var obj = snapshot.val();
      // Only add an id if the item is an object
      if (obj !== null && typeof obj === 'object') {
        obj.id = snapshot.name();
      }
      this._queuePush(function() {
        store.push(type, serializer.extractSingle(store, type, obj));
      });
    },

    /**
      Keep track of what types `.findAll()` has been called for
      so duplicate listeners aren't added
    */
    _findAllMapForType: undefined

  });

  Ember.onLoad('Ember.Application', function(Application) {
    Application.initializer({
      name: 'firebase',
      after: 'store',
      initialize: function(container, application) {
        application.register('serializer:-firebase', DS.FirebaseSerializer);
      }
    });
  });

})();