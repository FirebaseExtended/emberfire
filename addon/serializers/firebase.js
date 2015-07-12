import Ember from 'ember';
import DS from 'ember-data';
import assign from 'lodash/object/assign';

var fmt = Ember.String.fmt;

/**
 * The Firebase serializer helps normalize relationships and can be extended on
 * a per model basis.
 */
export default DS.JSONSerializer.extend(DS.EmbeddedRecordsMixin, {
  isNewSerializerAPI: true,

  /**
   * Overrides the default behaviour of JSONSerializer
   *
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
   *
   * @override
   */
  extractRelationships(modelClass, payload) {
    modelClass.eachRelationship((key, meta) => {
      if (meta.kind === 'hasMany') {
        if (payload.hasOwnProperty(key)) {

          // embedded
          if (this.hasDeserializeRecordsOption(key)) {
            if (typeof payload[key] === 'object' && !Ember.isArray(payload[key])) {
              payload[key] = Object.keys(payload[key]).map(function(id) {
                return assign({ id: id }, payload[key][id]);
              });
            } else if (Ember.isArray(payload[key])) {
              payload[key] = this._addNumericIdsToEmbeddedArray(payload[key]);
            } else {
              console.log('here');
              throw new Error(fmt('%@ relationship %@(\'%@\') must contain embedded records with an `id`. Example: { "%@": { "%@_1": { "id": "%@_1" } } } instead got: %@', [modelClass.toString(), meta.kind, meta.type, key, meta.type, meta.type, JSON.stringify(payload[key])] ));
            }
          }

          // normalized
          else {
            if (typeof payload[key] === 'object' && !Ember.isArray(payload[key])) {
              payload[key] = Object.keys(payload[key]);
            } else if (Ember.isArray(payload[key])) {
              payload[key] = this._convertBooleanArrayToIds(payload[key]);
            } else {
              console.log('here');
              throw new Error(fmt('%@ relationship %@(\'%@\') must be a key/value map. Example: { "%@": { "%@_1": true } } instead got: %@', [modelClass.toString(), meta.kind, meta.type, key, meta.type, JSON.stringify(payload[key])] ));
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
    });

    return this._super(modelClass, payload);
  },

  /**
   * Coerce arrays back into relationship arrays.
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
   * [true, true, null, true]
   *
   * What we need:
   *
   * [ "0", "1", "3" ]
   *
   * https://www.firebase.com/docs/web/guide/understanding-data.html#section-arrays-in-firebase
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
   * Fix embedded array ids.
   *
   * Stored in Firebase:
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
          throw new Error(fmt('expecting embedded object hash but found %@', [JSON.stringify(arr[i])] ));
        }
        result.push(assign({ id: '' + i }, arr[i]));
      }
    }
    return result;
  },


});
