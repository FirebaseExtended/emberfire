import Ember from 'ember';
import DS from 'ember-data';
import { pluralize } from 'ember-inflector';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';
import RSVP from 'rsvp';

import 'npm:firebase/firestore';

export type CollectionReference = import('firebase').firestore.CollectionReference;
export type Query = import('firebase').firestore.Query;
export type QuerySnapshot = import('firebase').firestore.QuerySnapshot;

export default class CloudFirestore extends DS.Adapter {

    defaultSerializer = '-cloud-firestore';
    firebase = service('firebase');
    
    findRecord(_: DS.Store, type: any, id: string) {
        return wrapFirebasePromise(() => docReference(this, type, id).get());
    };

    findAll(store: DS.Store, type: any) {
        return this.query(store, type, ref => ref);
    }

    findHasMany(_store: DS.Store, snapshot: DS.Snapshot<never>, _url: any, relationship: any) {
        const noop = (ref: CollectionReference) => ref
        const queryFn = relationship.options.query || noop;
        return getDocs(
            queryFn(
                relationship.options.embedded ?
                    docReference(this, relationship.parentType.modelName, snapshot.id)
                        .collection(collectionNameForType(relationship.type))
                :
                    rootCollection(this, relationship.type)
                        .where(relationship.parentType.modelName, '==', snapshot.id)
            )
        );
    }

    query(_store: DS.Store, type: any, queryFn: (ref: CollectionReference) => CollectionReference | Query) {
        const query = queryFn(rootCollection(this, type));
        return getDocs(query);
    }

    shouldBackgroundReloadRecord() {
        return false; // TODO can we make this dependent on a listener attached
    }

    updateRecord(_store: DS.Store, type: any, snapshot: DS.Snapshot<never>) {
        const id = snapshot.id;
        const data = this.serialize(snapshot, { includeId: false });
        return wrapFirebasePromise(() => docReference(this, type, id).update(data));
    }

    createRecord(_store: DS.Store, type: any, snapshot: DS.Snapshot<never>) {
        const id = snapshot.id;
        const data = this.serialize(snapshot, { includeId: false });
        if (id == null) {
            return wrapFirebasePromise(() => rootCollection(this, type).add(data));
        } else {
            return wrapFirebasePromise(() => docReference(this, type, id).set(data));
        }
    }

    deleteRecord(_store: DS.Store, type: any, snapshot: DS.Snapshot<never>) {
        return wrapFirebasePromise(() => docReference(this, type, snapshot.id).delete());
    }

};

declare module 'ember-data' {
    interface AdapterRegistry {
        'cloud-firestore': CloudFirestore;
    }
}

const wrapFirebasePromise = (fn: () => Promise<any>) => {
    return new RSVP.Promise((resolve, reject) => {
        fn().then(result => {
            Ember.run(() => resolve(result))
        }).catch(error => {
            Ember.run(() => reject(error))
        });
    });
}

const collectionNameForType = (type: any) => {
    const modelName = typeof(type) === 'string' ? type : type.modelName;
    return pluralize(camelize(modelName));
}

const docReference = (adapter: CloudFirestore, type: any, id: string) => rootCollection(adapter, type).doc(id);

const getDocs = (query: CollectionReference | Query) => {
    return wrapFirebasePromise(() =>
        query.get().then((snapshot: QuerySnapshot) => {
            const results: any = Object.assign([], snapshot.docs);
            results.__query__ = query;
            return results;
        })
    );
}

// TODO fix error TS2339: Property 'firestore' does not exist on type 'FirebaseApp'
const rootCollection = (adapter: CloudFirestore, type: any) =>
   (get(adapter, 'firebase').app() as any).firestore().collection(collectionNameForType(type))