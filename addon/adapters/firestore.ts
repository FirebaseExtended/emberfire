import Adapter from '@ember-data/adapter';
import Store from '@ember-data/store';
import { getOwner } from '@ember/application';
import { pluralize } from 'ember-inflector';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';
import RSVP, { resolve } from 'rsvp';
import FirebaseAppService from '../services/firebase-app';
import ModelRegistry from 'ember-data/types/registries/model';
import { firestore } from 'firebase/app';
import type DS from 'ember-data';

/**
 * Persist your Ember Data models in Cloud Firestore
 *
 * ```js
 * // app/adapters/application.js
 * import FirestoreAdapter from 'emberfire/adapters/firestore';
 *
 * export default class ApplicationAdapter extends FirestoreAdapter {
 *   // configuration goes here
 * }
 * ```
 *
 */
export default class FirestoreAdapter extends Adapter {
  /**
   * Override the default FirebaseApp Service used by the FirestoreAdapter: `service('firebase-app')`
   *
   * ```js
   * // app/adapters/application.js
   * import FirestoreAdapter from 'emberfire/adapters/firestore';
   * import { inject as service } from '@ember/service';
   *
   * export default class ApplicationAdapter extends  FirestoreAdapter {
   *   @service('firebase-different-app') firebaseApp;
   * };
   * ```
   *
   */
  //@ts-ignore
  @service declare firebaseApp: FirebaseAppService;

  /**
   * Namespace all of the default collections
   *
   * ```js
   * // app/adapters/application.js
   * import FirestoreAdapter from 'emberfire/adapters/firestore';
   *
   * export default class ApplicationAdapter extends FirestoreAdapter {
   *   namespace = 'environments/production'
   * }
   * ```
   *
   */
  // @ts-ignore repeat here for the tyepdocs
  namespace: string | undefined = undefined;

  /**
   * Override the default configuration of the Cloud Firestore adapter: `{ timestampsInSnapshots: true }`
   *
   * ```js
   * // app/adapters/application.js
   * import FirestoreAdapter from 'emberfire/adapters/firestore';
   *
   * export default class ApplicationAdapter extends FirestoreAdapter {
   *   settings = { timestampsInSnapshots: true }
   * }
   * ```
   *
   */
  // @ts-ignore repeat here for the tyepdocs
  settings: firestore.Settings = {};
  /**
   * Enable offline persistence with Cloud Firestore, it is not enabled by default
   *
   * ```js
   * // app/adapters/application.js
   * import FirestoreAdapter from 'emberfire/adapters/firestore';
   *
   * export default class ApplicationAdapter extends FirestoreAdapter {
   *   enablePersistence = true
   * }
   * ```
   *
   */
  // @ts-ignore repeat here for the tyepdocs
  enablePersistence: boolean;
  /**
   * Pass persistence settings to Cloud Firestore, enablePersistence has to be true for these to be used
   *
   * ```js
   * // app/adapters/application.js
   * import FirestoreAdapter from 'emberfire/adapters/firestore';
   *
   * export default class ApplicationAdapter extends FirestoreAdapter {
   *   enablePersistence = true;
   *   persistenceSettings = { synchronizeTabs: true }
   * }
   * ```
   *
   */
  // @ts-ignore repeat here for the tyepdocs
  persistenceSettings: firestore.PersistenceSettings = {};

  firestore: RSVP.Promise<firestore.Firestore> | undefined;
  defaultSerializer = '-firestore';

  findRecord<K extends keyof ModelRegistry>(
    store: Store,
    type: ModelRegistry[K],
    id: string,
    snapshot: any
  ) {
    return rootCollection(this, type).then((ref) =>
      includeRelationships(ref.doc(id).get(), store, this, snapshot, type)
    );
  }

  findAll<K extends keyof ModelRegistry>(store: Store, type: ModelRegistry[K]) {
    return this.query(store, type);
  }

  findHasMany<K extends keyof ModelRegistry>(
    store: Store,
    snapshot: DS.Snapshot<K>,
    url: string,
    relationship: { [key: string]: any }
  ) {
    const adapter = store.adapterFor(relationship.type as never) as any; // TODO fix types
    if (adapter !== this) {
      return adapter.findHasMany(
        store,
        snapshot,
        url,
        relationship
      ) as RSVP.Promise<any>;
    } else if (relationship.options.subcollection) {
      return docReference(this, relationship.parentModelName, snapshot.id).then(
        (doc) =>
          queryDocs(
            doc.collection(collectionNameForType(relationship.type)),
            relationship.options.query
          )
      );
    } else {
      return rootCollection(this, relationship.type).then((collection) =>
        queryDocs(
          collection.where(relationship.parentModelName, '==', snapshot.id),
          relationship.options.query
        )
      );
    }
  }

  findBelongsTo<K extends keyof ModelRegistry>(
    store: Store,
    snapshot: DS.Snapshot<K>,
    url: string,
    relationship: { [key: string]: any }
  ) {
    const adapter = store.adapterFor(relationship.type as never) as any; // TODO fix types
    if (adapter !== this) {
      return adapter.findBelongsTo(
        store,
        snapshot,
        url,
        relationship
      ) as RSVP.Promise<any>;
    } else {
      return getDoc(this, relationship.type, snapshot.id);
    }
  }

  query<K extends keyof ModelRegistry>(
    store: Store,
    type: ModelRegistry[K],
    options?: QueryOptions,
    _recordArray?: DS.AdapterPopulatedRecordArray<any>
  ) {
    return rootCollection(this, type)
      .then((collection) =>
        queryDocs(collection, queryOptionsToQueryFn(options))
      )
      .then((q) =>
        includeCollectionRelationships(q, store, this, options, type)
      );
  }

  queryRecord<K extends keyof ModelRegistry>(
    store: Store,
    type: ModelRegistry[K],
    options?: QueryOptions | QueryRecordOptions
  ) {
    return rootCollection(this, type)
      .then((ref: firestore.CollectionReference) => {
        const queryOrRef = queryRecordOptionsToQueryFn(options)(ref);
        if (isQuery(queryOrRef)) {
          return queryOrRef.limit(1).get();
        } else {
          (options as any).id = queryOrRef.id;
          return includeRelationships(
            queryOrRef.get() as any,
            store,
            this,
            options,
            type
          ); // TODO fix the types here, they're a little broken
        }
      })
      .then(
        (snapshot: firestore.QuerySnapshot | firestore.DocumentSnapshot) => {
          if (isQuerySnapshot(snapshot)) {
            return includeRelationships(
              resolve(snapshot.docs[0]),
              store,
              this,
              options,
              type
            );
          } else {
            return snapshot;
          }
        }
      );
  }

  shouldBackgroundReloadRecord() {
    return false; // TODO can we make this dependent on a listener attached
  }

  updateRecord<K extends keyof ModelRegistry>(
    _store: Store,
    type: ModelRegistry[K],
    snapshot: DS.Snapshot<K>
  ) {
    const id = snapshot.id;
    const data = this.serialize(snapshot, { includeId: false });
    // TODO is this correct? e.g, clear dirty state and trigger didChange; what about failure?
    return docReference(this, type, id).then((doc) => doc.update(data));
  }

  createRecord<K extends keyof ModelRegistry>(
    _store: Store,
    type: ModelRegistry[K],
    snapshot: DS.Snapshot<K>
  ) {
    const id = snapshot.id;
    const data = this.serialize(snapshot, { includeId: false });
    if (id) {
      return docReference(this, type, id).then((doc) =>
        doc.set(data).then(() => ({ doc, data }))
      );
    } else {
      return rootCollection(this, type).then((collection) => {
        const doc = collection.doc();
        (snapshot as any)._internalModel.setId(doc.id);
        return doc.set(data).then(() => ({ doc, data }));
      });
    }
  }

  deleteRecord<K extends keyof ModelRegistry>(
    _store: Store,
    type: ModelRegistry[K],
    snapshot: DS.Snapshot<K>
  ) {
    return docReference(this, type, snapshot.id).then((doc) => doc.delete());
  }
}

export type CollectionReferenceOrQuery =
  | firestore.CollectionReference
  | firestore.Query;
export type QueryFn = (
  ref: CollectionReferenceOrQuery
) => CollectionReferenceOrQuery;
export type QueryRecordFn = (
  ref: firestore.CollectionReference
) => firestore.DocumentReference;

export type WhereOp = [
  string | firestore.FieldPath,
  firestore.WhereFilterOp,
  any
];
export type OrderOp = string | { [key: string]: 'asc' | 'desc' };
export type BoundOp = firestore.DocumentSnapshot | any[];

export type QueryOptionsOnlyQuery = {
  query: (
    ref: firestore.CollectionReference
  ) => firestore.CollectionReference | firestore.Query;
};

// TODO adapterOptions?
export type QueryOptions = (
  | {
      filter?: { [key: string]: any };
      where?: WhereOp | WhereOp[];
      endAt?: BoundOp;
      endBefore?: BoundOp;
      startAt?: BoundOp;
      startAfter?: BoundOp;
      orderBy?: OrderOp;
      limit?: number;
    }
  | QueryOptionsOnlyQuery
) & { include?: string };

export type QueryRecordOptions = { doc: QueryRecordFn; include?: string };

// Type guards
const isDocOnly = (arg: any): arg is QueryRecordOptions =>
  arg.doc !== undefined;
const isQueryOnly = (arg: any): arg is QueryOptionsOnlyQuery =>
  arg.query !== undefined;
const isQuery = (arg: any): arg is firestore.Query => arg.limit !== undefined;
const isWhereOp = (arg: any): arg is WhereOp =>
  typeof arg[0] === 'string' || arg[0].length === undefined;
const isQuerySnapshot = (arg: any): arg is firestore.QuerySnapshot =>
  arg.docs !== undefined;

// Helpers
const noop = (ref: CollectionReferenceOrQuery) => ref;
const getDoc = (adapter: FirestoreAdapter, type: DS.Model, id: string) =>
  docReference(adapter, type, id).then((doc) => doc.get());
// TODO allow override
const collectionNameForType = (type: any) =>
  pluralize(camelize(typeof type === 'string' ? type : type.modelName));
const docReference = (adapter: FirestoreAdapter, type: any, id: string) =>
  rootCollection(adapter, type).then((collection) => collection.doc(id));
const getDocs = (query: CollectionReferenceOrQuery) => query.get();
export const rootCollection = (adapter: FirestoreAdapter, type: any) =>
  getFirestore(adapter).then((firestore) => {
    const namespace = get(adapter, 'namespace');
    const root = namespace ? firestore.doc(namespace) : firestore;
    return root.collection(collectionNameForType(type));
  });
const queryDocs = (
  referenceOrQuery: CollectionReferenceOrQuery,
  query?: QueryFn
) => getDocs((query || noop)(referenceOrQuery));

const queryRecordOptionsToQueryFn =
  (options?: QueryOptions | QueryRecordOptions) =>
  (ref: firestore.CollectionReference) =>
    isDocOnly(options) ? options.doc(ref) : queryOptionsToQueryFn(options)(ref);

// query: ref => ref.where(...)
// filter: { published: true }
// where: ['something', '<', 11]
// where: [['something', '<', 11], ['else', '==', true]]
// orderBy: 'publishedAt'
// orderBy: { publishedAt: 'desc' }
const queryOptionsToQueryFn =
  (options?: QueryOptions) =>
  (collectionRef: firestore.CollectionReference) => {
    let ref = collectionRef as CollectionReferenceOrQuery;
    if (options) {
      if (isQueryOnly(options)) {
        return options.query(collectionRef);
      }
      if (options.filter) {
        Object.keys(options.filter).forEach((field) => {
          ref = ref.where(field, '==', options.filter![field]);
        });
      }
      if (options.where) {
        const runWhereOp = ([field, op, value]: WhereOp) =>
          (ref = ref.where(field, op, value));
        if (isWhereOp(options.where)) {
          runWhereOp(options.where);
        } else {
          options.where.forEach(runWhereOp);
        }
      }
      if (options.orderBy) {
        if (typeof options.orderBy === 'string') {
          ref = ref.orderBy(options.orderBy);
        } else {
          Object.keys(options.orderBy).forEach((field) => {
            ref = ref.orderBy(
              field,
              (options.orderBy as any)[field] as 'asc' | 'desc'
            ); // TODO fix type
          });
        }
      }
      if (options.endAt) {
        ref = ref.endAt(options.endAt);
      }
      if (options.endBefore) {
        ref = ref.endBefore(options.endBefore);
      }
      if (options.startAt) {
        ref = ref.startAt(options.startAt);
      }
      if (options.startAfter) {
        ref = ref.startAfter(options.startAfter);
      }
      if (options.limit) {
        ref = ref.limit(options.limit);
      }
    }
    return ref;
  };

const getFirestore = (adapter: FirestoreAdapter) => {
  let cachedFirestoreInstance = adapter.firestore;
  if (!cachedFirestoreInstance) {
    const app = adapter.firebaseApp;
    cachedFirestoreInstance = app.firestore().then((firestore) => {
      const settings = adapter.settings;
      firestore.settings(settings);
      const enablePersistence = adapter.enablePersistence;
      //@ts-ignore
      const fastboot = getOwner(adapter).lookup('service:fastboot');
      if (enablePersistence && (fastboot == null || !fastboot.isFastBoot)) {
        const persistenceSettings = adapter.persistenceSettings;
        firestore.enablePersistence(persistenceSettings).catch(console.warn);
      }
      return firestore;
    });
    set(adapter, 'firestore', cachedFirestoreInstance);
  }
  return cachedFirestoreInstance!;
};

const includeCollectionRelationships = (
  collection: firestore.QuerySnapshot,
  store: Store,
  adapter: FirestoreAdapter,
  snapshot: any,
  type: any
): Promise<firestore.QuerySnapshot> => {
  if (snapshot && snapshot.include) {
    const includes = snapshot.include.split(',') as Array<string>;
    const relationshipsToInclude = includes
      .map((e) => type.relationshipsByName.get(e) as { [key: string]: any })
      .filter((r) => !!r && !r.options.embedded);
    return Promise.all(
      relationshipsToInclude.map((r) => {
        if (r.meta.kind == 'hasMany') {
          return Promise.all(
            collection.docs.map((d) =>
              adapter.findHasMany(store, { id: d.id } as any, '', r)
            )
          );
        } else {
          const belongsToIds = [
            ...new Set(
              collection.docs
                .map((d) => d.data()[r.meta.key])
                .filter((id) => !!id)
            ),
          ];
          return Promise.all(
            belongsToIds.map((id) =>
              adapter.findBelongsTo(store, { id } as any, '', r)
            )
          );
        }
      })
    ).then((allIncludes) => {
      relationshipsToInclude.forEach((r: any, i: number) => {
        const relationship = r.meta;
        const pluralKey = pluralize(relationship.key);
        const key =
          relationship.kind == 'belongsTo' ? relationship.key : pluralKey;
        const includes = allIncludes[i];
        collection.docs.forEach((doc) => {
          if (relationship.kind == 'belongsTo') {
            const result = includes.find((r: any) => r.id == doc.data()[key]);
            if (result) {
              if (!(doc as any)._document) {
                (doc as any)._document = {};
              }
              if (!(doc as any)._document._included) {
                (doc as any)._document._included = {};
              }
              (doc as any)._document._included[key] = result;
            }
          } else {
            if (!(doc as any)._document) {
              (doc as any)._document = {};
            }
            if (!(doc as any)._document._included) {
              (doc as any)._document._included = {};
            }
            (doc as any)._document._included[pluralKey] = includes;
          }
        });
      });
      return collection;
    });
  } else {
    return resolve(collection);
  }
};

const includeRelationships = <T = any>(
  promise: Promise<T>,
  store: Store,
  adapter: FirestoreAdapter,
  snapshot: any,
  type: any
): Promise<T> => {
  if (snapshot && snapshot.include) {
    const includes = snapshot.include.split(',') as Array<string>;
    const relationshipsToInclude = includes
      .map((e) => type.relationshipsByName.get(e) as { [key: string]: any })
      .filter((r) => !!r && !r.options.embedded);
    const hasManyRelationships = relationshipsToInclude.filter(
      (r) => r.meta.kind == 'hasMany'
    );
    const belongsToRelationships = relationshipsToInclude.filter(
      (r) => r.meta.kind == 'belongsTo'
    );
    return Promise.all([
      promise,
      ...hasManyRelationships.map((r) =>
        adapter.findHasMany(store, snapshot, '', r)
      ),
    ])
      .then(([doc, ...includes]) => {
        if (!(doc as any)._document) {
          (doc as any)._document = {};
        }
        //@ts-ignore
        doc._document._included = hasManyRelationships.reduce((c, e, i) => {
          c[e.key] = includes[i];
          return c;
        }, {});
        return Promise.all([
          resolve(doc),
          ...belongsToRelationships
            //@ts-ignore
            .filter((r) => !!doc.data()[r.meta.key])
            .map((r) => {
              return adapter.findBelongsTo(
                store,
                //@ts-ignore
                { id: doc.data()[r.meta.key] } as any,
                '',
                r
              );
            }),
        ]);
      })
      .then(([doc, ...includes]) => {
        //@ts-ignore
        doc._document._included = {
          //@ts-ignore
          ...doc._document._included,
          ...belongsToRelationships.reduce((c, e, i) => {
            c[e.key] = includes[i];
            return c;
          }, {}),
        };
        return doc;
      });
  } else {
    return promise;
  }
};

declare module 'ember-data' {
  interface AdapterRegistry {
    firestore: FirestoreAdapter;
  }
}
