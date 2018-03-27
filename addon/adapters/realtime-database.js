import Ember from 'ember';
import DS from 'ember-data';

import { pluralize } from 'ember-inflector';
const { inject: { service }, String: { camelize } } = Ember;

export default DS.Adapter.extend({
    
    defaultSerializer: '-realtime-database',
    store: service(),
    realtimeDatabase: service(),

    findRecord(store, type, id) {
        return this._rootCollection(type).child(id).once('value');
    },

    findAll(store, type) {
        return this.query(store, type, ref => ref);
    },

    findHasMany(store, snapshot, url, relationship) {
        const queryFn = relationship.options.query || (ref => ref);
        return this._getDocs(
            queryFn(
                relationship.options.embedded ?
                    this._rootCollection(relationship.parentType.modelName)
                        .child(snapshot.id)
                        .child(this._collectionNameForType(relationship.type))
                :
                    this._rootCollection(relationship.type)
                        .orderByChild(relationship.parentType.modelName)
                        .equalTo(snapshot.id)
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
        return this.get('realtimeDatabase').ref(this._collectionNameForType(type));
    },

    _getDocs(query) {
        return query.once('value').then(snapshot => {
            let results = [];
            snapshot.forEach(doc => {
                let next = doc;
                next.id = doc.key;
                results.push(next);
            });
            results.$query = query;
            return results;
        });
    }

});