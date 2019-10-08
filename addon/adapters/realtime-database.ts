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

    namespace: undefined as string|undefined,
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
     * Namespace all of the paths
     * 
     * ```js
     * // app/adapters/application.js
     * import RealtimeDatabaseAdapter from 'emberfire/adapters/realtime-database';
     *
     * export default RealtimeDatabaseAdapter.extend({
     *   namespace: 'environments/production'
     * });
     * ```
     * 
     */
    // @ts-ignore repeat here for the tyepdocs
    namespace: string|undefined;
    
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

    findRecord<K extends keyof ModelRegistry>(_store: DS.Store, type: ModelRegistry[K], id: string) {
        return docReference(this, type, id).then(doc => doc.once('value'));
    }

    findAll<K extends keyof ModelRegistry>(store: DS.Store, type: ModelRegistry[K]) {
        return this.query(store, type)
    }

    findHasMany<K extends keyof ModelRegistry>(store: DS.Store, snapshot: DS.Snapshot<K>, url: string, relationship: {[key:string]: any}) {
        const adapter = store.adapterFor(relationship.type as never) as any; // TODO kill the any
        if (adapter !== this) {
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
            return adapter.findBelongsTo(store, snapshot, url, relationship) as RSVP.Promise<any>;
        } else {
            return docReference(this, relationship.type, snapshot.id).then(ref => ref.once('value'));
        }
    }

    query<K extends keyof ModelRegistry>(_store: DS.Store, type: ModelRegistry[K], options?: QueryOptions) {
        return rootCollection(this, type).then(ref => queryDocs(ref, queryOptionsToQueryFn(options)));
    }

    queryRecord<K extends keyof ModelRegistry>(_store: DS.Store, type: ModelRegistry[K], options?: QueryOptions) {
        const query = rootCollection(this, type).then(ref => queryDocs(ref.limitToFirst(1), queryOptionsToQueryFn(options)));
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

    createRecord<K extends keyof ModelRegistry>(_store: DS.Store, type: ModelRegistry[K], snapshot: DS.Snapshot<K>) {
        const id = snapshot.id;
        const data = this.serialize(snapshot, { includeId: false });
        if (id) {
            return docReference(this, type, id).then(ref => ref.set(data).then(() => ({ref, data})));
        } else {
            return rootCollection(this, type).then(ref => ref.push()).then(ref => {
                (snapshot as any)._internalModel.setId(ref.key!);
                return ref.set(data).then(() => ({ref, data}));
            });
        }
    }

    deleteRecord<K extends keyof ModelRegistry>(_: DS.Store, type: ModelRegistry[K], snapshot: DS.Snapshot<K>) {
        return docReference(this, type, snapshot.id).then(ref => ref.remove());
    }

}

export type ReferenceOrQuery = database.Reference | database.Query;
export type ReferenceOrQueryFn = (ref: ReferenceOrQuery) => ReferenceOrQuery;
export type QueryFn = (ref: database.Reference) => ReferenceOrQuery;

// Keeping this for compatability with version 2
export enum OrderBy { Key = '_key', Value = '_value', Priority = '_priority' }

export type BoundOp = string|number|boolean|null|[string|number|boolean|null,string];

export type QueryOptionsOnlyQuery = {
    query: (ref: database.Reference) => database.Reference|database.Query
}

// TODO adapterOptions?
export type QueryOptions = ({
    filter?: {[key:string]:string|number|boolean|null},
    endAt?: BoundOp,
    equalTo?: BoundOp,
    limitToFirst?: number,
    limitToLast?: number,
    orderBy?: string|OrderBy,
    startAt?: BoundOp
} | QueryOptionsOnlyQuery) & { include?: string }

const isQueryOnly = (arg: any): arg is QueryOptionsOnlyQuery => arg.query !== undefined;

// query: ref => ref.orderByChild('asdf')
// filter: { published: true }
// orderBy: OrderBy.Key, equalTo: 'asdf'
// orderBy: 'publishedAt'
const queryOptionsToQueryFn = (options?:QueryOptions) => (collectionRef:database.Reference) => {
    let ref = collectionRef as ReferenceOrQuery;
    if (options) {
        if (isQueryOnly(options)) { return options.query(collectionRef); }
        if (options.filter) {
            Object.keys(options.filter).forEach(field => {
                ref = ref.orderByChild(field).equalTo(options.filter![field]);
            })
        }
        if (options.orderBy) {
            switch(options.orderBy) {
                case OrderBy.Key:
                    ref = ref.orderByKey();
                    break;
                case OrderBy.Priority:
                    ref = ref.orderByPriority();
                    break;
                case OrderBy.Value:
                    ref = ref.orderByValue();
                    break;
                default:
                    ref = ref.orderByChild(options.orderBy);
            }
        }
        if (options.equalTo !== undefined) { ref = options.equalTo && typeof options.equalTo === "object" ? ref.equalTo(options.equalTo[0], options.equalTo[1]) : ref.equalTo(options.equalTo)  }
        if (options.startAt !== undefined) { ref = options.startAt && typeof options.startAt === "object" ? ref.startAt(options.startAt[0], options.startAt[1]) : ref.startAt(options.startAt) }
        if (options.endAt   !== undefined) { ref = options.endAt   && typeof options.endAt   === "object" ? ref.endAt(options.endAt[0],     options.endAt[1])   : ref.endAt(options.endAt) }
        if (options.limitToFirst) { ref = ref.limitToFirst(options.limitToFirst) }
        if (options.limitToLast)  { ref = ref.limitToLast(options.limitToLast) }
    }
    return ref;
}


const noop = (ref: database.Reference) => ref;
const queryDocs = (referenceOrQuery: ReferenceOrQuery, query?: ReferenceOrQueryFn) => getDocs((query || noop)(referenceOrQuery));
// TODO allow override
const collectionNameForType = (type: any) =>  pluralize(camelize(typeof(type) === 'string' ? type : type.modelName));
export const rootCollection = (adapter: RealtimeDatabaseAdapter, type: any) => databaseInstance(adapter).then(database => database.ref([get(adapter, 'namespace'), collectionNameForType(type)].join('/')));
const getDocs = (query: ReferenceOrQuery) => query.once('value').then(value => ((value as any).query = query) && value);
const docReference = (adapter: RealtimeDatabaseAdapter, type: any, id: string) => rootCollection(adapter, type).then(ref => ref.child(id));

const databaseInstance = (adapter: RealtimeDatabaseAdapter) => {
    let database = get(adapter, 'database');
    if (!database) {
        const app = get(adapter, 'firebaseApp');
        const databaseURL = get(adapter, 'databaseURL');
        database = app.database(databaseURL);
        set(adapter, 'database', database);
    }
    return database!;
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'realtime-database': RealtimeDatabaseAdapter;
    }
}