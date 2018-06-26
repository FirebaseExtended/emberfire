import { run } from '@ember/runloop';
import DS from 'ember-data';
import { getOwner } from '@ember/application';
import { pluralize } from 'ember-inflector';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';
import RSVP from 'rsvp';
import Ember from 'ember';
import FirebaseAppService from '../services/firebase-app';

import { firestore } from 'firebase';

export type CollectionReferenceOrQuery = firestore.CollectionReference | firestore.Query;
export type QueryFn = (ref: CollectionReferenceOrQuery) => CollectionReferenceOrQuery;

/**
 * Persist your Ember Data models in Cloud Firestore
 * 
 * ```js
 * // app/adapters/application.js
 * import FirestoreAdapter from 'emberfire/adapters/firestore';
 *
 * export default FirestoreAdapter.extend({
 *   // configuration goes here
 * });
 * ```
 * 
 */
export default class FirestoreAdapter extends DS.Adapter.extend({

    firebaseApp: service('firebase-app'),
    settings: { timestampsInSnapshots: true } as firestore.Settings,
    enablePersistence: false as boolean,
    firestore: undefined as firestore.Firestore|undefined,
    defaultSerializer: '-firestore'

}) {

    /**
     * Enable offline persistence with Cloud Firestore, it is not enabled by default
     * 
     * ```js
     * // app/adapters/application.js
     * import FirestoreAdapter from 'emberfire/adapters/firestore';
     *
     * export default FirestoreAdapter.extend({
     *   enablePersistence: true
     * });
     * ```
     * 
     */
    // @ts-ignore repeat here for the tyepdocs
    enablePersistence: boolean;

    /**
     * Override the default configuration of the Cloud Firestore adapter: `{ timestampsInSnapshots: true }`
     * 
     * ```js
     * // app/adapters/application.js
     * import FirestoreAdapter from 'emberfire/adapters/firestore';
     *
     * export default FirestoreAdapter.extend({
     *   settings: { timestampsInSnapshots: false }
     * });
     * ```
     * 
     */
    // @ts-ignore repeat here for the tyepdocs
    settings: firestore.Settings;
    
    /**
     * Override the default FirebaseApp Service used by the FirestoreAdapter: `service('firebase-app')`
     * 
     * ```js
     * // app/adapters/application.js
     * import FirestoreAdapter from 'emberfire/adapters/firestore';
     * import { inject as service } from '@ember/service';
     *
     * export default FirestoreAdapter.extend({
     *   firebaseApp: service('firebase-different-app')
     * });
     * ```
     * 
     */
    // @ts-ignore repeat here for the tyepdocs
    firebaseApp: Ember.ComputedProperty<FirebaseAppService, FirebaseAppService>;

    findRecord(_store: DS.Store, type: any, id: string) {
        return getDoc(this, type, id);
    };

    findAll(_store: DS.Store, type: any) {
        return queryDocs(rootCollection(this, type));
    }

    findHasMany(_store: DS.Store, snapshot: DS.Snapshot<never>, _url: any, relationship: any) {
        return queryDocs(
            relationship.options.subcollection ?
                // fetch the sub-collection
                docReference(this, relationship.parentType, snapshot.id)
                    .collection(collectionNameForType(relationship.type)) :
                // query the root collection
                rootCollection(this, relationship.type)
                    .where(relationship.parentType.modelName, '==', snapshot.id),
            relationship.options.query
        );
    }

    findBelongsTo(_store: DS.Store, snapshot: DS.Snapshot<never>, _url: any, relationship: any) {
        return getDoc(this, relationship.type, snapshot.id);
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
        return wrapPromiseLike<firestore.DocumentReference|void>(() => {
            if (id) {
                return docReference(this, type, id).set(data);
            } else {
                // TODO sort out bringing back the id, just then snapshot => id?
                return rootCollection(this, type).add(data);
            }
        });
    }

    deleteRecord(_store: DS.Store, type: any, snapshot: DS.Snapshot<never>) {
        return wrapPromiseLike(() => docReference(this, type, snapshot.id).delete());
    }

};

declare module 'ember-data' {
    interface AdapterRegistry {
        'firestore': FirestoreAdapter;
    }
}

const getDoc = (adapter: FirestoreAdapter, type: DS.Model, id: string) =>
    wrapPromiseLike(() => docReference(adapter, type, id).get());

const wrapPromiseLike = <T=any>(fn: () => PromiseLike<T>) => {
    return new RSVP.Promise<T>((resolve, reject) => {
        fn().then(
            result => run(() => resolve(result)),
            reason => run(() => reject(reason))
        );
    });
}

/*
const canonicalId = (query: firestore.DocumentReference | CollectionReferenceOrQuery) => {
    const keyPath = get(query as any, '_key.path');
    return keyPath ? `${keyPath}|f:|ob:__name__asc,` : get(query as any, 'memoizedCanonicalId');
}*/

const collectionNameForType = (type: any) => {
    const modelName = typeof(type) === 'string' ? type : type.modelName;
    return pluralize(camelize(modelName));
}

const docReference = (adapter: FirestoreAdapter, type: any, id: string) => rootCollection(adapter, type).doc(id);

const getDocs = (query: CollectionReferenceOrQuery) => wrapPromiseLike(() => query.get());

const firestoreInstance = (adapter: FirestoreAdapter) => {
    let cachedFirestoreInstance = get(adapter, 'firestore');
    if (!cachedFirestoreInstance) {
        const app = get(adapter, 'firebaseApp');
        cachedFirestoreInstance = app.firestore();
        const settings = get(adapter, 'settings');
        cachedFirestoreInstance.settings(settings);
        const enablePersistence = get(adapter, 'enablePersistence');
        const fastboot = getOwner(adapter).lookup('service:fastboot');
        if (enablePersistence && (fastboot == null || !fastboot.isFastBoot)) {
           cachedFirestoreInstance.enablePersistence().catch(console.warn);
        }
        set(adapter, 'firestore', cachedFirestoreInstance);
    }
    return cachedFirestoreInstance;
}

const rootCollection = (adapter: FirestoreAdapter, type: any) => 
    firestoreInstance(adapter).collection(collectionNameForType(type))

const queryDocs = (referenceOrQuery: CollectionReferenceOrQuery, query?: QueryFn) => {
    const noop = (ref: CollectionReferenceOrQuery) => ref;
    const queryFn = query || noop;
    return getDocs(queryFn(referenceOrQuery));
}