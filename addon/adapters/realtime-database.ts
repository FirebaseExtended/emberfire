import { pluralize } from 'ember-inflector';
import { camelize } from '@ember/string';
import RSVP from 'rsvp';
import DS from 'ember-data';
import Ember from 'ember';
import FirebaseAppService from '../services/firebase-app';
import ModelRegistry from 'ember-data/types/registries/model';

import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';
import { database } from 'firebase/app';

export type ReferenceOrQuery = database.Reference | database.Query;
export type ReferenceOrQueryFn = (ref: ReferenceOrQuery) => ReferenceOrQuery;
export type QueryFn = (ref: database.Reference) => ReferenceOrQuery;

/**
 * Persist your Ember Data models in the Firebase Realtime Database
 * 
 * ```js
 * // app/adapters/application.js
 * import RealtimeDatabaseAdapter from 'emberfire/adapters/realtime-database';
 *
 * export default RealtimeDatabaseAdapter.extend({
 *   // configuration goes here
 * });
 * ```
 * 
 */
export default class RealtimeDatabaseAdapter extends DS.Adapter.extend({

    firebaseApp: service('firebase-app'),
    databaseURL: undefined,
    database: undefined as RSVP.Promise<database.Database>|undefined,
    defaultSerializer: '-realtime-database'

}) {

    /**
     * Override the default FirebaseApp Service used by the RealtimeDatabaseAdapter: `service('firebase-app')`
     * 
     * ```js
     * // app/adapters/application.js
     * import RealtimeDatabaseAdapter from 'emberfire/adapters/realtime-database';
     * import { inject as service } from '@ember/service';
     *
     * export default RealtimeDatabaseAdapter.extend({
     *   firebaseApp: service('firebase-different-app')
     * });
     * ```
     * 
     */
    // @ts-ignore repeat here for the tyepdocs
    firebaseApp: Ember.ComputedProperty<FirebaseAppService, FirebaseAppService>;
    
    /**
     * Override the default database used by the RealtimeDatabaseAdapter
     * 
     * ```js
     * // app/adapters/application.js
     * import RealtimeDatabaseAdapter from 'emberfire/adapters/realtime-database';
     *
     * export default RealtimeDatabaseAdapter.extend({
     *   databaseURL: 'https://DIFFERENT_DATABASE.firebaseio.com'
     * });
     * ```
     * 
     */
    // @ts-ignore repeat here for the tyepdocs
    databaseURL?: string;

    findRecord<K extends keyof ModelRegistry>(store: DS.Store, type: ModelRegistry[K], id: string) {
        return this.queryRecord(store, type, ref => ref.child(id));
    }

    findAll<K extends keyof ModelRegistry>(store: DS.Store, type: ModelRegistry[K]) {
        return this.query(store, type, ref => ref)
    }

    findHasMany<K extends keyof ModelRegistry>(store: DS.Store, snapshot: DS.Snapshot<K>, url: string, relationship: {[key:string]: any}) {
        const adapter = store.adapterFor(relationship.type as never) as any; // TODO kill the any
        if (adapter !== this) {
            // TODO allow for different serializers, if not already working
            return adapter.findHasMany(store, snapshot, url, relationship) as RSVP.Promise<any>;
        } else if (relationship.options.subcollection) {
            throw `subcollections (${relationship.parentModelName}.${relationship.key}) are not supported by the Realtime Database, consider using embedded relationships or check out Firestore`;
        } else {
            return rootCollection(this, relationship.type).then(ref => queryDocs(
                ref.orderByChild(relationship.parentModelName).equalTo(snapshot.id),
                relationship.options.query
            ));
        }
    }

    findBelongsTo<K extends keyof ModelRegistry>(store: DS.Store, snapshot: DS.Snapshot<K>, url: any, relationship: any) {
        const adapter = store.adapterFor(relationship.type as never) as any;  // TODO kill the any
        if (adapter !== this) {
            // TODO allow for different serializers, if not already working
            return adapter.findBelongsTo(store, snapshot, url, relationship) as RSVP.Promise<any>;
        } else {
            return docReference(this, relationship.type, snapshot.id).then(ref => ref.once('value'));
        }
    }

    query<K extends keyof ModelRegistry>(_store: DS.Store, type: ModelRegistry[K], queryFn: QueryFn) {
        return rootCollection(this, type).then(ref => queryDocs(ref, queryFn));
    }

    queryRecord<K extends keyof ModelRegistry>(_store: DS.Store, type: ModelRegistry[K], queryFn: QueryFn) {
        const query = rootCollection(this, type).then(ref => queryDocs(ref.limitToFirst(1), queryFn));
        return query.then(results => {
            let snapshot = undefined as database.DataSnapshot|undefined;
            results.forEach(doc => !!(snapshot = doc));
            if (snapshot) {
                return snapshot;
            } else {
                throw new DS.NotFoundError();
            }
        });
    }

    shouldBackgroundReloadRecord() {
        return false; // TODO can we make this dependent on a listener attached
    }

    updateRecord<K extends keyof ModelRegistry>(_: DS.Store, type: ModelRegistry[K], snapshot: DS.Snapshot<K>) {
        const id = snapshot.id;
        const data = this.serialize(snapshot, { includeId: false });
        // TODO is this correct? e.g, clear dirty state and trigger didChange; what about failure?
        return docReference(this, type, id).then(ref => ref.set(data));
    }

    createRecord<K extends keyof ModelRegistry>(_: DS.Store, type: ModelRegistry[K], snapshot: DS.Snapshot<K>) {
        const id = snapshot.id;
        const data = this.serialize(snapshot, { includeId: false });
        // TODO remove the unnecessary once('value'), handle in serializer if I can (noramlizeCreateResponse right?) also this fails if read permissions is denied
        if (id == null) {
            return rootCollection(this, type).then(ref => ref.push(data).then(ref => ref.once('value')));
        } else {
            return docReference(this, type, id).then(ref => ref.set(data).then(() => ref.once('value')));
        }
    }

    deleteRecord<K extends keyof ModelRegistry>(_: DS.Store, type: ModelRegistry[K], snapshot: DS.Snapshot<K>) {
        return docReference(this, type, snapshot.id).then(ref => ref.remove());
    }

}

declare module 'ember-data' {
    interface AdapterRegistry {
        'realtime-database': RealtimeDatabaseAdapter;
    }
}

const queryDocs = (referenceOrQuery: ReferenceOrQuery, query?: ReferenceOrQueryFn) => {
    const noop = (ref: database.Reference) => ref;
    const queryFn = query || noop;
    return getDocs(queryFn(referenceOrQuery));
}

const collectionNameForType = (type: any) => {
    const modelName = typeof(type) === 'string' ? type : type.modelName;
    return pluralize(camelize(modelName));
}

const databaseInstance = (adapter: RealtimeDatabaseAdapter) => {
    let database = get(adapter, 'database');
    if (!database) {
        const app = get(adapter, 'firebaseApp');
        const databaseURL = get(adapter, 'databaseURL');
        database = app.database(databaseURL);
        set(adapter, 'database', database);
    }
    return database;
}

const rootCollection = (adapter: RealtimeDatabaseAdapter, type: any) => 
   databaseInstance(adapter).then(database => database.ref(collectionNameForType(type)));

const getDocs = (query: ReferenceOrQuery) => query.once('value')

const docReference = (adapter: RealtimeDatabaseAdapter, type: any, id: string) => 
    rootCollection(adapter, type).then(ref => ref.child(id))