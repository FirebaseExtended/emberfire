import Ember from 'ember';
import DS from 'ember-data';

import { pluralize } from 'ember-inflector';
const { inject: { service }, String: { camelize } } = Ember;

export default DS.Adapter.extend({
    
    defaultSerializer: '-cloud-firestore',
    cloudFirestore: service(),

    findRecord(_, type, id) {
        return this._docReference(type, id).get();
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
                        .collection(this._collectionNameForType(relationship.type))
                :
                    this._rootCollection(relationship.type)
                        .where(relationship.parentType.modelName, '==', snapshot.id)
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
        return this._docReference(type, id).update(data);
    },

    createRecord(_, type, snapshot) {
        const id = snapshot.id;
        const data = this.serialize(snapshot, { includeId: false });
        if (id == null) {
            return this._rootCollection(type).add(data);
        } else {
            return this._docReference(type, id).set(data);
        }
    },

    deleteRecord(_, type, id) {
        return this._docReference(type, id).delete();
    },

    _collectionNameForType(type) {
        const modelName = typeof(type) === 'string' ? type : type.modelName;
        return pluralize(camelize(modelName));
    },

    _docReference(type, id) {
        return this._rootCollection(type).doc(id);
    },

    _rootCollection(type) {
        return this.get('cloudFirestore').collection(this._collectionNameForType(type));
    },

    _getDocs(query) {
        return query.get().then(snapshot => {
            const results = snapshot.docs;
            results.__query__ = query;
            return results;
        });
    }

}); 