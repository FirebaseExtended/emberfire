import { pluralize } from 'ember-inflector';
import { camelize } from '@ember/string';
import RSVP from 'rsvp';
import Ember from 'ember';
import { DS } from 'ember-data';

import 'npm:firebase/database';

import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';

import { database } from 'firebase';

export type ReferenceOrQuery = database.Reference | database.Query;
export type QueryFn = (ref: ReferenceOrQuery) => ReferenceOrQuery;

export default class RealtimeDatabase extends DS.Adapter.extend({

    firebaseApp: service('firebase-app'),
    databaseURL: undefined as string|undefined,

}) {

    database?: database.Database;
    defaultSerializer = '-realtime-database';

    findRecord(_store: DS.Store, type: any, id: string) {
        return wrapPromiseLike(() => docReference(this, type, id).once('value'));
    }

    findAll(_store: DS.Store, type: any) {
        return queryDocs(rootCollection(this, type));
    }

    findHasMany(_store: DS.Store, snapshot: any, _url: string, relationship: any) {
        queryDocs(
            relationship.options.embedded ?
                docReference(this, relationship.parentType.modelName, snapshot.id)
                    .child(collectionNameForType(relationship.type)):
                rootCollection(this, relationship.type)
                    .orderByChild(relationship.parentType.modelName)
                    .equalTo(snapshot.id),
            relationship.options.query
        );
    }

    query(_store: DS.Store, type: any, queryFn: QueryFn) {
        return queryDocs(rootCollection(this, type), queryFn);
    }

    queryRecord(_store: DS.Store, type: any, queryFn: QueryFn) {
        const query = queryDocs(rootCollection(this, type).limitToFirst(1), queryFn);
        return query.then((results:any[]) => results[0]);
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

};

declare module 'ember-data' {
    interface AdapterRegistry {
        'realtime-database': RealtimeDatabase;
    }
}

const queryDocs = (referenceOrQuery: ReferenceOrQuery, query?: QueryFn) => {
    const noop = (ref: database.Reference) => ref;
    const queryFn = query || noop;
    return getDocs(queryFn(referenceOrQuery));
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

const databaseInstance = (adapter: RealtimeDatabase) => {
    let database = get(adapter, 'database');
    if (!database) {
        const app = get(adapter, 'firebaseApp');
        const databaseURL = get(adapter, 'databaseURL');
        database = app.database(databaseURL);
        set(adapter, 'database', database);
    }
    return database;
}

const rootCollection = (adapter: RealtimeDatabase, type: any) => 
    databaseInstance(adapter).ref(collectionNameForType(type));

const getDocs = (query: ReferenceOrQuery) => {
    return wrapPromiseLike(() => 
        query.once('value').then(snapshot => {
            let results: any[] = [];
            snapshot.forEach(doc => {
                let next: any = Object.assign({}, doc);
                results.push(next);
            });
            (results as any).$query = query;
            return results;
        })
    );
}

const docReference = (adapter: RealtimeDatabase, type: any, id: string) => 
    rootCollection(adapter, type).child(id);