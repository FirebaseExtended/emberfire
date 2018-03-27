import Ember from 'ember';
import DS from 'ember-data';

import { pluralize } from 'ember-inflector';
const { inject: { service }, String: { camelize } } = Ember;

export default DS.Adapter.extend({
    
    defaultSerializer: '-realtime-database',
    realtimeDatabase: service(),

    findRecord(_, type, id) {
        return this._docReference(type, id).once('value');
    },

    findAll(store, type) {
        return this.query(store, type, ref => ref);
    },

    findHasMany(_, snapshot, url, relationship) {
        const queryFn = relationship.options.query || (ref => ref);
        return this._getDocs(
            queryFn(
                relationship.options.embedded ?
                    this._docReference(relationship.parentType.modelName, snapshot.id)
                        .child(this._collectionNameForType(relationship.type))
                :
                    this._rootCollection(relationship.type)
                        .orderByChild(relationship.parentType.modelName)
                        .equalTo(snapshot.id)
            )
        );
    },

    query(_, type, queryFn) {
        const query = queryFn(this._rootCollection(type));
        return this._getDocs(query);
    },

    shouldBackgroundReloadRecord() {
        return false; // TODO can we make this dependent on a listener attached
    },

    updateRecord(_, type, snapshot) {
        const id = snapshot.id;
        const data = this.serialize(snapshot, { includeId: false });
        return this._docReference(type, id).set(data);
    },

    createRecord(_, type, snapshot) {
        const id = snapshot.id;
        const data = this.serialize(snapshot, { includeId: false });
        if (id == null) {
            return this._rootCollection(type).push(data);
        } else {
            return this._docReference(type, id).set(data);
        }
    },

    deleteRecord(_, type, id) {
        return this._docReference(type, id).remove();
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
    },

    _docReference(type, id) {
        return this._rootCollection(type).child(id);
    }

});