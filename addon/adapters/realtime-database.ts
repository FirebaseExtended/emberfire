import { pluralize } from 'ember-inflector';
import { camelize } from '@ember/string';
import RSVP from 'rsvp';
import DS from 'ember-data';
import { run } from '@ember/runloop';
import Ember from 'ember';
import FirebaseAppService from '../services/firebase-app';

import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';
import { database } from 'firebase';

export type ReferenceOrQuery = database.Reference | database.Query;
export type QueryFn = (ref: ReferenceOrQuery) => ReferenceOrQuery;

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
    database: undefined as database.Database|undefined,
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

    findRecord(_store: DS.Store, type: any, id: string) {
        return wrapPromiseLike(() => docReference(this, type, id).once('value'));
    }

    findAll(_store: DS.Store, type: any) {
        return queryDocs(rootCollection(this, type));
    }

    findHasMany(_store: DS.Store, snapshot: any, _url: string, relationship: any) {
        if (relationship.options.subcollection) { throw `subcollections (${relationship.parentType.modelName}.${relationship.key}) are not supported by the Realtime Database, consider using embedded relationships or check out Firestore` }
        return queryDocs(
            rootCollection(this, relationship.type)
                .orderByChild(relationship.parentType.modelName)
                .equalTo(snapshot.id),
            relationship.options.query
        );
    }

    findBelongsTo(_store: DS.Store, snapshot: DS.Snapshot<never>, _url: any, relationship: any) {
        return wrapPromiseLike(() => docReference(this, relationship.type, snapshot.id).once('value'));
    }

    query(_store: DS.Store, type: any, queryFn: QueryFn) {
        return queryDocs(rootCollection(this, type), queryFn);
    }

    queryRecord(_store: DS.Store, type: any, queryFn: QueryFn) {
        const query = queryDocs(rootCollection(this, type).limitToFirst(1), queryFn);
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

    updateRecord(_: DS.Store, type: any, snapshot: DS.Snapshot<never>) {
        const id = snapshot.id;
        const data = this.serialize(snapshot, { includeId: false });
        return wrapPromiseLike(() => docReference(this, type, id).set(data));
    }

    createRecord(_: DS.Store, type: any, snapshot: DS.Snapshot<never>) {
        const id = snapshot.id;
        const data = this.serialize(snapshot, { includeId: false });
        return wrapPromiseLike(() => {
            if (id == null) {
                return rootCollection(this, type).push(data);
            } else {
                return docReference(this, type, id).set(data);
            }
        });
    }

    deleteRecord(_: DS.Store, type: any, snapshot: DS.Snapshot<never>) {
        return wrapPromiseLike(() => docReference(this, type, snapshot.id).remove());
    }

}

declare module 'ember-data' {
    interface AdapterRegistry {
        'realtime-database': RealtimeDatabaseAdapter;
    }
}

const queryDocs = (referenceOrQuery: ReferenceOrQuery, query?: QueryFn) => {
    const noop = (ref: database.Reference) => ref;
    const queryFn = query || noop;
    return getDocs(queryFn(referenceOrQuery));
}

const wrapPromiseLike = <T=any>(fn: () => PromiseLike<T>) => {
    return new RSVP.Promise<T>((resolve, reject) => {
        fn().then(
            result => run(() => resolve(result)),
            reason => run(() => reject(reason))
        );
    });
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
    databaseInstance(adapter).ref(collectionNameForType(type))

const getDocs = (query: ReferenceOrQuery) => wrapPromiseLike(() => query.once('value'))

const docReference = (adapter: RealtimeDatabaseAdapter, type: any, id: string) => 
    rootCollection(adapter, type).child(id)