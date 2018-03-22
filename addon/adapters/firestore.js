import Ember from 'ember';
import DS from 'ember-data';

import _ from 'npm:@firebase/firestore';

import { pluralize } from 'ember-inflector';
const { inject: { service }, String: { camelize } } = Ember;

export default DS.Adapter.extend({
    
    firebase: service(),
    store: service(),

    findRecord(store, type, id) {
        return this._rootCollection(type).doc(id).get();
    },

    findAll(store, type) {
        return this.query(store, type, ref => ref);
    },

    findHasMany(store, snapshot, url, relationship) {
        const queryFn = relationship.options.query || (ref => ref);
        return this._getDocs(
            queryFn(
                relationship.options.embedded ?
                    this._rootCollection(relationship.parentType.modelName).doc(snapshot.id)
                        .collection(this._collectionNameForType(relationship.type))
                :
                    this._rootCollection(relationship.type)
                        .where(relationship.parentType.modelName, '==', snapshot.id)
            )
        );
    },

    query(store, type, queryFn) {
        const query = queryFn(this._rootCollection(type));
        return this._getDocs(query);
    },

    _collectionNameForType(type) {
        const modelName = typeof(type) === 'string' ? type : type.modelName;
        return pluralize(camelize(modelName));
    },

    _rootCollection(type) {
        return this.get('firebase').firestore().collection(this._collectionNameForType(type));
    },

    _getDocs(query) {
        return query.get().then(snapshot => {
            const results = snapshot.docs;
            results.query = query;
            return results;
        });
    }

});