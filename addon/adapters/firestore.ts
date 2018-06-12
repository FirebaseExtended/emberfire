import Ember from 'ember';
import DS from 'ember-data';
import { pluralize } from 'ember-inflector';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';
import RSVP from 'rsvp';

import 'npm:firebase/firestore';
import { firestore } from 'firebase';

export type ReferenceOrQuery = firestore.CollectionReference | firestore.Query;
export type QueryFn = (ref: ReferenceOrQuery) => ReferenceOrQuery;

export default class Firestore extends DS.Adapter.extend({

    firebaseApp: service('firebase-app'),
    firestoreSettings: { timestampsInSnapshots: true } as firestore.Settings,
    enablePersistence: false as boolean

}) {

    firestore? : firestore.Firestore;
    defaultSerializer = '-firestore';
    
    findRecord(_store: DS.Store, type: any, id: string) {
        return wrapPromiseLike(() => docReference(this, type, id).get());
    };

    findAll(_store: DS.Store, type: any) {
        return queryDocs(rootCollection(this, type));
    }

    findHasMany(_store: DS.Store, snapshot: DS.Snapshot<never>, _url: any, relationship: any) {
        return queryDocs(
            relationship.options.embedded ?
                docReference(this, relationship.parentType.modelName, snapshot.id)
                    .collection(collectionNameForType(relationship.type)) :
                rootCollection(this, relationship.type)
                    .where(relationship.parentType.modelName, '==', snapshot.id),
            relationship.options.query
        );
    }

    query(_store: DS.Store, type: any, queryFn: QueryFn) {
        return queryDocs(rootCollection(this, type), queryFn);
    }

    shouldBackgroundReloadRecord() {
        return false; // TODO can we make this dependent on a listener attached
    }

    updateRecord(_store: DS.Store, type: any, snapshot: DS.Snapshot<never>) {
        const id = snapshot.id;
        const data = this.serialize(snapshot, { includeId: false });
        return wrapPromiseLike(() => docReference(this, type, id).update(data));
    }

    createRecord(_store: DS.Store, type: any, snapshot: DS.Snapshot<never>) {
        const id = snapshot.id;
        const data = this.serialize(snapshot, { includeId: false });
        return wrapPromiseLike(() => {
            if (id == null) {
                return rootCollection(this, type).add(data);
            } else {
                return docReference(this, type, id).set(data);
            }
        });
    }

    deleteRecord(_store: DS.Store, type: any, snapshot: DS.Snapshot<never>) {
        return wrapPromiseLike(() => docReference(this, type, snapshot.id).delete());
    }

};

declare module 'ember-data' {
    interface AdapterRegistry {
        'firestore': Firestore;
    }
}

const wrapPromiseLike = (fn: () => PromiseLike<any>) => {
    return new RSVP.Promise((resolve, reject) => {
        fn().then(
            result => Ember.run(() => resolve(result)),
            reason => Ember.run(() => reject(reason))
        );
    });
}

const collectionNameForType = (type: any) => {
    const modelName = typeof(type) === 'string' ? type : type.modelName;
    return pluralize(camelize(modelName));
}

const docReference = (adapter: Firestore, type: any, id: string) => rootCollection(adapter, type).doc(id);

const getDocs = (query: ReferenceOrQuery) => {
    return wrapPromiseLike(() =>
        query.get().then((snapshot: firestore.QuerySnapshot) => {
            const results: any = Object.assign([], snapshot.docs);
            results.__query__ = query;
            return results;
        })
    );
}

const firestoreInstance = (adapter: Firestore) => {
    let cachedFirestoreInstance = get(adapter, 'firestore');
    if (!cachedFirestoreInstance) {
        const app = get(adapter, 'firebaseApp');
        cachedFirestoreInstance = app.firestore();
        const firestoreSettings = get(adapter, 'firestoreSettings');
        cachedFirestoreInstance.settings(firestoreSettings);
        const enablePersistence = get(adapter, 'enablePersistence');
        if (enablePersistence) {
           cachedFirestoreInstance.enablePersistence().catch(console.warn);
        }
        set(adapter, 'firestore', cachedFirestoreInstance);
    }
    return cachedFirestoreInstance;
}

const rootCollection = (adapter: Firestore, type: any) => 
    firestoreInstance(adapter).collection(collectionNameForType(type))

const queryDocs = (referenceOrQuery: ReferenceOrQuery, query?: QueryFn) => {
    const noop = (ref: firestore.CollectionReference) => ref;
    const queryFn = query || noop;
    return getDocs(queryFn(referenceOrQuery));
}