import Ember from 'ember';
import DS from 'ember-data';

var map = Ember.EnumerableUtils.map;
var fmt = Ember.String.fmt;

/**
  The Firebase serializer helps normalize relationships and can be extended on
  a per model basis.
*/
export default DS.JSONSerializer.extend(Ember.Evented, {

  //We need to account for Firebase turning key/value pairs with ids '1' and '0' into arrays
  //See https://github.com/firebase/emberfire/issues/124
  _normalizeNumberIDs: function(hash, key) {
    var newHash = [];
    if (hash[key][0] === true) {
      newHash.push('0');
    }
    if (hash[key][1] === true) {
      newHash.push('1');
    }
    hash[key] = newHash;
  },

  normalizeHasMany: function(typeClass, hash, relationship) {
    var key = relationship.key;
    if (typeof hash[key] === 'object' && !Ember.isArray(hash[key])) {
      hash[key] = Ember.keys(hash[key]);
    }
    //We need to account for Firebase turning key/value pairs with ids '1' and '0' into arrays
    //See https://github.com/firebase/emberfire/issues/124
    else if (Ember.isArray(hash[key]) && hash[key].length < 3 && (hash[key][0] === true || hash[key][1] === true)) {
      this._normalizeNumberIDs(hash, key);
    }
    else if (Ember.isArray(hash[key])) {
      throw new Error(fmt('%@ relationship %@(\'%@\') must be a key/value map in Firebase. Example: { "%@": { "%@_id": true } }', [typeClass.toString(), relationship.kind, relationship.type, key, relationship.type]));
    }
  },

  normalizeEmbeddedHasMany: function(typeClass, hash, relationship, ref) {
    var key = relationship.key;
    var embedded = hash[key];
    var embeddedRef;
    if (!hash[key]) {
      return;
    }
    var modelName = typeClass.modelName;
    ref = ref || this.store.adapterFor(modelName)._getRef(typeClass, hash.id);

    for (var id in embedded) {
      var payload = embedded[id];
      if (payload !== null && typeof payload === 'object') {
        payload.id = id;
      }
      embeddedRef = ref.child(key).child(id);
      var embeddedTypeClass = this.store.modelFor(relationship.type);
      var record = this.store.push(relationship.type, this.normalize(embeddedTypeClass, payload, embeddedRef));
      record.__firebaseRef = embeddedRef;
    }
    hash[key] = Ember.keys(hash[key]);
  },

  normalizeEmbeddedBelongsTo: function(typeClass, hash, relationship, ref) {
    var key = relationship.key;
    if (!hash[key]) {
      return;
    }

    var modelName = typeClass.modelName;
    ref = ref || this.store.adapterFor(modelName)._getRef(typeClass, hash.id);

    var payload = hash[key];
    if (typeof payload.id !== 'string') {
      throw new Error(fmt('Embedded relationship "%@" of "%@" must contain an "id" property in the payload', [relationship.type, typeClass]));
    }
    var embeddedRef = ref.child(key);
    var embeddedTypeClass = this.store.modelFor(relationship.type);
    var record = this.store.push(relationship.type, this.normalize(embeddedTypeClass, payload, embeddedRef));
    record.__firebaseRef = embeddedRef;

    hash[key] = payload.id;
  },

  normalizeBelongsTo: Ember.K,
  /**
    Called after `extractSingle()`. This method checks the model
    for `hasMany` relationships and makes sure the value is an object.
    The object is then converted to an Array using `Ember.keys`
  */
  normalize: function(typeClass, hash, ref) {
    var serializer = this;
    // Check if the model contains any 'hasMany' relationships
    typeClass.eachRelationship(function(key, relationship) {
      if (relationship.kind === 'hasMany') {
        if (relationship.options.embedded) {
          serializer.normalizeEmbeddedHasMany(typeClass, hash, relationship, ref);
        } else {
          serializer.normalizeHasMany(typeClass, hash, relationship);
        }
      } else {
        if (relationship.options.embedded) {
          serializer.normalizeEmbeddedBelongsTo(typeClass, hash, relationship, ref);
        } else {
          serializer.normalizeBelongsTo(typeClass, hash, relationship);
        }
      }
    });
    return this._super.apply(this, arguments);
  },

  /**
    Called on a records returned from `find()` and all records
    returned from `findAll()`

    This method also checks for `embedded: true`, extracts the
    embedded records, pushes them into the store, and then replaces
    the records with an array of ids
  */
  extractSingle: function(store, typeClass, payload) {
    return this.normalize(typeClass, payload);
  },

  /**
    Called after the adpter runs `findAll()` or `findMany()`. This method runs
    `extractSingle()` on each item in the payload and as a result each item
    will have `normalize()` called on it
  */
  extractArray: function(store, typeClass, payload) {
    return map(payload, function(item) {
      return this.extractSingle(store, typeClass, item);
    }, this);
  },

  /**
    Overrides ember-data's `serializeHasMany` to serialize oneToMany
    relationships.
  */
  serializeHasMany: function(snapshot, json, relationship) {
    var record = snapshot.record || snapshot;
    var key = relationship.key;
    var payloadKey = this.keyForRelationship ? this.keyForRelationship(key, "hasMany") : key;
    json[payloadKey] = Ember.A(record.get(key)).mapBy('id');
  },

  serializeBelongsTo: function(snapshot, json, relationship) {
    this._super(snapshot, json, relationship);
    var key = relationship.key;
    // var payloadKey = this.keyForRelationship ? this.keyForRelationship(key, "belongsTo") : relationship.key;
    if (typeof json[key] === "undefined" || json[key] === '') {
      delete json[key];
    }
  }

});
