import Ember from 'ember';
import DS from 'ember-data';
import assign from 'lodash/object/assign';

/**
 * The Firebase serializer helps normalize relationships and can be extended on
 * a per model basis.
 */
export default DS.JSONSerializer.extend(DS.EmbeddedRecordsMixin, {
  isNewSerializerAPI: true,


  /**
   * Firebase does not send null values, it omits the key altogether. This nullifies omitted
   * properties so that property deletions sync correctly.
   *
   * @override
   */
  extractAttributes(modelClass, resourceHash) {
    var attributes = this._super(modelClass, resourceHash);

    // nullify omitted attributes
    modelClass.eachAttribute((key) => {
      if (!attributes.hasOwnProperty(key)) {
        attributes[key] = null;
      }
    });

    return attributes;
  },


  /**
   * @override
   */
  extractRelationships(modelClass, payload) {
    this.normalizeRelationships(modelClass, payload);

    return this._super(modelClass, payload);
  },


  /**
   * Normalizes `hasMany` relationship structure before passing
   * to `JSONSerializer.extractRelationships`
   *
   * before:
   *
   * ```js
   * {
   *   comments: {
   *     abc: true,
   *     def: true,
   *   }
   * }
   * ```
   *
   * after:
   *
   * ```js
   * {
   *   comments: [ 'abc', 'def' ]
   * }
   * ```
   *
   * Or for embedded objects:
   *
   * ```js
   * {
   *   comments: {
   *     'abc': { body: 'a' },
   *     'def': { body: 'd' )
   *   }
   * }
   * ```
   *
   * these should become:
   *
   * ```js
   * {
   *   comments: [
   *     {
   *       id: 'abc',
   *       body: 'a'
   *     },
   *     {
   *       id: 'def',
   *       body: 'd'
   *     }
   *   ]
   * }
   * ```
   */
  normalizeRelationships(modelClass, payload) {
    modelClass.eachRelationship((key, meta) => {
      if (meta.kind === 'hasMany') {
        if (payload.hasOwnProperty(key)) {

          // embedded
          if (this.hasDeserializeRecordsOption(key)) {
            if (typeof payload[key] === 'object' && !Ember.isArray(payload[key])) {
              payload[key] = Object.keys(payload[key]).map((id) => {
                return assign({ id: id }, payload[key][id]);
              });
            } else if (Ember.isArray(payload[key])) {
              payload[key] = this._addNumericIdsToEmbeddedArray(payload[key]);
            } else {
              throw new Error(`${modelClass.toString()} relationship ${meta.kind}('${meta.type}') must contain embedded records with an \`id\`. Example: { "${key}": { "${meta.type}_1": { "id": "${meta.type}_1" } } } instead got: ${JSON.stringify(payload[key])}`);
            }
          }

          // normalized
          else {
            if (typeof payload[key] === 'object' && !Ember.isArray(payload[key])) {
              payload[key] = Object.keys(payload[key]);
            } else if (Ember.isArray(payload[key])) {
              payload[key] = this._convertBooleanArrayToIds(payload[key]);
            } else {
              throw new Error(`${modelClass.toString()} relationship ${meta.kind}('${meta.type}') must be a key/value map. Example: { "${key}": { "${meta.type}_1": true } } instead got: ${JSON.stringify(payload[key])}`);
            }
          }

        }

        // hasMany property is not present
        // server will not send a property which has no content
        // (i.e. it will never send `comments: null`) so we need to
        // force the empty relationship
        else {
          payload[key] = [];
        }
      }

      if (meta.kind === 'belongsTo') {
        if (!payload.hasOwnProperty(key)) {
          // server wont send property if it was made null elsewhere
          payload[key] = null;
        }
      }
    });
  },


  /**
   * Coerce arrays back into relationship arrays. When numeric ids are used
   * the firebase server will send back arrays instead of object hashes in
   * certain situations.
   *
   * See the conditions and reasoning here:
   * https://www.firebase.com/docs/web/guide/understanding-data.html#section-arrays-in-firebase
   *
   * Stored in Firebase:
   *
   * ```json
   * {
   *   "0": true,
   *   "1": true,
   *   "3": true
   * }
   * ```
   *
   * Given back by the JS client:
   *
   * ```js
   * [true, true, null, true]
   * ```
   *
   * What we need:
   *
   * ```js
   * [ "0", "1", "3" ]
   * ```
   *
   * @param {Array} arr   Input array
   * @return {Array}      Fixed array
   * @private
   */
  _convertBooleanArrayToIds(arr) {
    var result = [];
    for (var i = 0; i <  arr.length; i++) {
      if (arr[i] === true) {
        result.push('' + i);
      }
      else if (typeof arr[i] === 'string') {
        throw new Error(`hasMany relationship contains invalid data, should be in the form: { comment_1: true, comment_2: true } but was ${JSON.stringify(arr)}`);
      }
    }
    return result;
  },


  /**
   * Coerce a hasMany array into a boolean relationship hash map.
   *
   * Given by `snapshot.hasMany`:
   *
   * ```json
   * [ "0", "1", "3" ]
   * ```
   *
   * Stored in Firebase:
   *
   * ```json
   * {
   *   "0": true,
   *   "1": true,
   *   "3": true
   * }
   * ```
   *
   * @param {Array} arr   Input array
   * @return {Object}     Boolean hash map
   * @private
   */
  _convertIdArrayToBooleanHash(ids) {
    var result = {};

    ids.forEach(function(id) {
      result[id] = true;
    });

    return result;
  },

  /**
   * Coerce an embedded hasMany array into an object hash.
   *
   * Given by `snapshot.hasMany`:
   *
   * ```json
   * [ { id: 'a' }, { id: 'b' }, { id: 'c' } ]
   * ```
   *
   * Stored in Firebase:
   *
   * ```json
   * {
   *   "a": {},
   *   "b": {},
   *   "c": {}
   * }
   * ```
   *
   * @param {Array} arr   Input array
   * @return {Object}     Embedded Object hash
   * @private
   */
  _convertObjectArrayToHash(objects) {
    var result = {};

    objects.forEach(function(object) {
      result[object.id] = object;
    });

    return result;
  },

  /**
   * Fix embedded array ids.
   *
   * Objects are stored in Firebase with their id in the key only:
   *
   * ```json
   * {
   *   "0": { obj0 },
   *   "1": { obj1 },
   *   "3": { obj3 }
   * }
   * ```
   *
   * Given back by the JS client:
   *
   * ```js
   * [{ obj0 }, { obj1 }, null, { obj3 }]
   * ```
   *
   * What we need:
   *
   * ```js
   * [ { id: '0', ...obj0 }, { id: '1', ...obj1 }, { id: '3', ...obj3 } ]
   * ```
   *
   * https://www.firebase.com/docs/web/guide/understanding-data.html#section-arrays-in-firebase
   *
   * @param {Array} arr   Input array
   * @return {Array}      Fixed array
   * @private
   */
  _addNumericIdsToEmbeddedArray(arr) {
    var result = [];
    for (var i = 0; i <  arr.length; i++) {
      if (arr[i]) {
        if (typeof arr[i] !== 'object') {
          throw new Error(`expecting embedded object hash but found ${JSON.stringify(arr[i])}`);
        }
        result.push(assign({ id: '' + i }, arr[i]));
      }
    }
    return result;
  },


  /**
   * Overrides the normal bevahior to convert numeric hasMany arrays into
   * boolean relationship hashes.
   *
   * @override
   */
  serializeHasMany: function (snapshot, json, relationship) {
    this._super(snapshot, json, relationship);

    var key = relationship.key;

    if (this._shouldSerializeHasMany(snapshot, key, relationship)) {
      var hasMany = snapshot.hasMany(key, { ids: true });
      if (hasMany !== undefined) {
        // if provided, use the mapping provided by `attrs` in
        // the serializer
        var payloadKey = this._getMappedKey(key, snapshot.type);
        if (payloadKey === key && this.keyForRelationship) {
          payloadKey = this.keyForRelationship(key, "hasMany", "serialize");
        }

        if (this.hasSerializeRecordsOption(key)) {
          json[payloadKey] = this._convertObjectArrayToHash(json[payloadKey]);

          // ensure if there are no relations, the property is cleared on server
          if (Object.keys(json[payloadKey]).length === 0) {
            json[payloadKey] = null;
          }

        } else {
          json[payloadKey] = this._convertIdArrayToBooleanHash(hasMany);
        }
      }
    }
  },


  /**
   * @override
   */
  _shouldSerializeHasMany(snapshot, key, relationship) {
    return this._canSerialize(key);
  }
});
