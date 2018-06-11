import Ember from 'ember';
import DS from 'ember-data';
import { pluralize } from 'ember-inflector';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';
import RSVP from 'rsvp';

import 'npm:firebase/firestore';
import { firestore } from 'firebase';

export default class Firestore extends DS.Adapter {

    defaultSerializer = '-firestore';
    firebaseApp = service('firebase-app');
    
    findRecord(_: DS.Store, type: any, id: string) {
        return wrapFirebasePromise(() => docReference(this, type, id).get());
    };

    findAll(store: DS.Store, type: any) {
        return this.query(store, type, ref => ref);
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

    query(_store: DS.Store, type: any, queryFn: (ref: firestore.CollectionReference) => firestore.CollectionReference | firestore.Query) {
        return queryDocs(rootCollection(this, type), queryFn);
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
        'firestore': Firestore;
    }
}

const wrapFirebasePromise = (fn: () => Promise<any>) => {
    return new RSVP.Promise((resolve, reject) => {
        fn().then(result => 
            Ember.run(() => resolve(result))
        ).catch(error => 
            Ember.run(() => reject(error))
        );
    });
}

const collectionNameForType = (type: any) => {
    const modelName = typeof(type) === 'string' ? type : type.modelName;
    return pluralize(camelize(modelName));
}

const docReference = (adapter: Firestore, type: any, id: string) => rootCollection(adapter, type).doc(id);

const getDocs = (query: firestore.CollectionReference | firestore.Query) => {
    return wrapFirebasePromise(() =>
        query.get().then((snapshot: firestore.QuerySnapshot) => {
            const results: any = Object.assign([], snapshot.docs);
            results.__query__ = query;
            return results;
        })
    );
}

// TODO fix error TS2339: Property 'firestore' does not exist on type 'FirebaseApp'
const rootCollection = (adapter: Firestore, type: any) =>
   get(adapter, 'firebaseApp').firestore!().collection(collectionNameForType(type))

const queryDocs = (referenceOrQuery: firestore.CollectionReference | firestore.Query, query?: (ref: firestore.CollectionReference|firestore.Query) => firestore.CollectionReference | firestore.Query) => {
    const noop = (ref: firestore.CollectionReference) => ref;
    const queryFn = query || noop;
    return getDocs(queryFn(referenceOrQuery));
}