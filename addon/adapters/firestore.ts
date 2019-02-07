import DS from 'ember-data';
import { getOwner } from '@ember/application';
import { pluralize } from 'ember-inflector';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';
import RSVP from 'rsvp';
import Ember from 'ember';
import FirebaseAppService from '../services/firebase-app';

import { firestore } from 'firebase/app';

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
    settings: { } as firestore.Settings,
    enablePersistence: false as boolean,
    persistenceSettings: { } as firestore.PersistenceSettings,
    firestore: undefined as RSVP.Promise<firestore.Firestore>|undefined,
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
     *   settings: { timestampsInSnapshots: true }
     * });
     * ```
     * 
     */
    // @ts-ignore repeat here for the tyepdocs
    settings: firestore.Settings;

    /**
     * Pass persistence settings to Cloud Firestore, enablePersistence has to be true for these to be used
     * 
     * ```js
     * // app/adapters/application.js
     * import FirestoreAdapter from 'emberfire/adapters/firestore';
     *
     * export default FirestoreAdapter.extend({
     *   enablePersistence: true,
     *   persistenceSettings: { experimentalTabSynchronization: true }
     * });
     * ```
     * 
     */
    // @ts-ignore repeat here for the tyepdocs
    persistenceSettings: firestore.PersistenceSettings;
    
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
    }

    findAll(_store: DS.Store, type: any) {
        return rootCollection(this, type).then(queryDocs);
    }

    findHasMany(store: DS.Store, snapshot: DS.Snapshot<never>, url: any, relationship: any) {
        if (store.adapterFor(relationship.type) !== this) {
            return store.adapterFor(relationship.type).findHasMany(store, snapshot, url, relationship);
        } else if (relationship.options.subcollection) {
            return docReference(this, relationship.parentModelName, snapshot.id).then(doc => queryDocs(doc.collection(collectionNameForType(relationship.type)), relationship.options.query));
        } else {
            return rootCollection(this, relationship.type).then(collection => queryDocs(collection.where(relationship.parentModelName, '==', snapshot.id), relationship.options.query));
        }
    }

    findBelongsTo(store: DS.Store, snapshot: DS.Snapshot<never>, url: any, relationship: any) {
        if (store.adapterFor(relationship.type) !== this) {
            return store.adapterFor(relationship.type).findBelongsTo(store, snapshot, url, relationship);
        } else {
            return getDoc(this, relationship.type, snapshot.id);
        }
    }

    query(_store: DS.Store, type: any, queryFn: QueryFn) {
        return rootCollection(this, type).then(collection => queryDocs(collection, queryFn));
    }

    shouldBackgroundReloadRecord() {
        return false; // TODO can we make this dependent on a listener attached
    }

    updateRecord(_store: DS.Store, type: any, snapshot: DS.Snapshot<never>) {
        const id = snapshot.id;
        const data = this.serialize(snapshot, { includeId: false });
        return docReference(this, type, id).then(doc => doc.update(data));
    }

    createRecord(_store: DS.Store, type: any, snapshot: DS.Snapshot<never>) {
        const id = snapshot.id;
        const data = this.serialize(snapshot, { includeId: false });
        // TODO remove the unnecessary get()
        if (id) {
            return docReference(this, type, id).then(doc => doc.set(data).then(() => doc.get()));
        } else {
            return rootCollection(this, type).then(collection => collection.add(data)).then(doc => doc.get());
        }
    }

    deleteRecord(_store: DS.Store, type: any, snapshot: DS.Snapshot<never>) {
        return docReference(this, type, snapshot.id).then(doc => doc.delete());
    }

}

declare module 'ember-data' {
    interface AdapterRegistry {
        'firestore': FirestoreAdapter;
    }
}

const getDoc = (adapter: FirestoreAdapter, type: DS.Model, id: string) =>
    docReference(adapter, type, id).then(doc => doc.get());

/*
const canonicalId = (query: firestore.DocumentReference | CollectionReferenceOrQuery) => {
    const keyPath = get(query as any, '_key.path');
    return keyPath ? `${keyPath}|f:|ob:__name__asc,` : get(query as any, 'memoizedCanonicalId');
}*/

const collectionNameForType = (type: any) => {
    const modelName = typeof(type) === 'string' ? type : type.modelName;
    return pluralize(camelize(modelName));
};

const docReference = (adapter: FirestoreAdapter, type: any, id: string) => rootCollection(adapter, type).then(collection => collection.doc(id));

const getDocs = (query: CollectionReferenceOrQuery) => query.get();

const firestoreInstance = (adapter: FirestoreAdapter) => {
    let cachedFirestoreInstance = get(adapter, 'firestore');
    if (!cachedFirestoreInstance) {
        const app = get(adapter, 'firebaseApp');
        cachedFirestoreInstance = app.firestore().then(firestore => {
            const settings = get(adapter, 'settings');
            firestore.settings(settings);
            const enablePersistence = get(adapter, 'enablePersistence');
            const fastboot = getOwner(adapter).lookup('service:fastboot');
            if (enablePersistence && (fastboot == null || !fastboot.isFastBoot)) {
                const persistenceSettings = get(adapter, 'persistenceSettings');
                firestore.enablePersistence(persistenceSettings).catch(console.warn);
            }
            return firestore;
        });
        set(adapter, 'firestore', cachedFirestoreInstance);
    }
    return cachedFirestoreInstance;
};

const rootCollection = (adapter: FirestoreAdapter, type: any) => 
    firestoreInstance(adapter).then(firestore => firestore.collection(collectionNameForType(type)))

const queryDocs = (referenceOrQuery: CollectionReferenceOrQuery, query?: QueryFn) => {
    const noop = (ref: CollectionReferenceOrQuery) => ref;
    const queryFn = query || noop;
    return getDocs(queryFn(referenceOrQuery));
}