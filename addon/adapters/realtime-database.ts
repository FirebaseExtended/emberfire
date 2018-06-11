import { pluralize } from 'ember-inflector';
import { camelize } from '@ember/string';
import RSVP from 'rsvp';
import Ember from 'ember';
import { DS } from 'ember-data';

import 'npm:firebase/database';

import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export type Reference = import('firebase').database.Reference;
export type ReferenceOrQuery = Reference | import('firebase').database.Query;
export type Query = (ref: Reference) => ReferenceOrQuery;
export type ThenableReference = import('firebase').database.ThenableReference;
export type Snapshot = import('firebase').database.DataSnapshot;

export default class RealtimeDatabase extends DS.Adapter {

    defaultSerializer = '-realtime-database';
    firebaseApp = service('firebase-app');

    findRecord(_store: DS.Store, type: any, id: string) {
        return wrapFirebasePromise(() => docReference(this, type, id).once('value'));
    }

    findAll(store: DS.Store, type: any) {
        return this.query(store, type, ref => ref);
    }

    findHasMany(_store: DS.Store, snapshot: any, _url: string, relationship: any) {
        const noop = (ref: Reference) => ref;
        const queryFn = relationship.options.query || noop;
        return getDocs(
            queryFn(
                relationship.options.embedded ?
                    docReference(this, relationship.parentType.modelName, snapshot.id)
                        .child(collectionNameForType(relationship.type))
                :
                    rootCollection(this, relationship.type)
                        .orderByChild(relationship.parentType.modelName)
                        .equalTo(snapshot.id)
            )
        );
    }

    query(_store: DS.Store, type: any, queryFn: Query) {
        const query = queryFn(rootCollection(this, type));
        return getDocs(query);
    }

    queryRecord(_store: DS.Store, type: any, queryFn: Query) {
        const query = queryFn(rootCollection(this, type)).limitToFirst(1);
        return getDocs(query).then((results:any[]) => results[0]);
    }

    shouldBackgroundReloadRecord() {
        return false; // TODO can we make this dependent on a listener attached
    }

    updateRecord(_: DS.Store, type: any, snapshot: DS.Snapshot<never>) {
        const id = snapshot.id;
        const data = this.serialize(snapshot, { includeId: false });
        return wrapFirebasePromise(() => docReference(this, type, id).set(data));
    }

    createRecord(_: DS.Store, type: any, snapshot: DS.Snapshot<never>) {
        const id = snapshot.id;
        const data = this.serialize(snapshot, { includeId: false });
        if (id == null) {
            return wrapFirebasePromise(() => rootCollection(this, type).push(data));
        } else {
            return wrapFirebasePromise(() => docReference(this, type, id).set(data));
        }
    }

    deleteRecord(_: DS.Store, type: any, snapshot: DS.Snapshot<never>) {
        return wrapFirebasePromise(() => docReference(this, type, snapshot.id).remove());
    }

};

declare module 'ember-data' {
    interface AdapterRegistry {
        'realtime-database': RealtimeDatabase;
    }
}

const wrapFirebasePromise = (fn: () => Promise<any>|ThenableReference) => {
    return new RSVP.Promise(async (resolve, reject) => {
        try {
            const result = await fn();
            Ember.run(() => resolve(result))
        } catch(error) {
            Ember.run(() => reject(error))
        }
    });
}

const collectionNameForType = (type: any) => {
    const modelName = typeof(type) === 'string' ? type : type.modelName;
    return pluralize(camelize(modelName));
}

const rootCollection = (adapter: RealtimeDatabase, type: any) =>
    get(adapter, 'firebaseApp').database().ref(collectionNameForType(type));

const getDocs = (query: ReferenceOrQuery) => {
    return wrapFirebasePromise(() => 
        query.once('value').then((snapshot: Snapshot) => {
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