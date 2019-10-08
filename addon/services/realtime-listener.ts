import Service from '@ember/service';
import { getOwner } from '@ember/application';
import DS from 'ember-data';
import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { firestore, database } from 'firebase/app';

// TODO don't hardcode these, but having trouble otherwise
import { rootCollection as firestoreRootCollection } from '../adapters/firestore';
import { rootCollection as realtimeDatabaseRootCollection } from '../adapters/realtime-database';

const getService = (object:Object) => getOwner(object).lookup('service:realtime-listener') as RealtimeListenerService;
const isFastboot = (object:Object) => {
    const fastboot = getOwner(object).lookup('service:fastboot');
    return fastboot && fastboot.isFastBoot;
}

export const subscribe = (route: Object, model: DS.Model) => !isFastboot(route) && getService(route).subscribe(route, model);
export const unsubscribe = (route: Object, model?: DS.Model) => !isFastboot(route) && getService(route).unsubscribe(route, model);

const setRouteSubscription = (service: RealtimeListenerService, route: Object, uniqueIdentifier: string, unsubscribe: () => void) => {
    const routeSubscriptions = get(service, `routeSubscriptions`);
    const existingSubscriptions = routeSubscriptions[route.toString()];
    if (existingSubscriptions) {
        const existingSubscription = existingSubscriptions[uniqueIdentifier];
        if (existingSubscription) { existingSubscription() }
    } else {
        routeSubscriptions[route.toString()] = {};
    }
    routeSubscriptions[route.toString()][uniqueIdentifier] = unsubscribe;
}

const unsubscribeRoute = (service: RealtimeListenerService, route: Object, uniqueIdentifier?: string) => {
    const routeSubscriptions = get(service, `routeSubscriptions`);
    const existingSubscriptions = get(routeSubscriptions, route.toString());
    if (existingSubscriptions) {
        if (uniqueIdentifier) {
            if (existingSubscriptions[uniqueIdentifier]) {
                existingSubscriptions[uniqueIdentifier]();
                delete existingSubscriptions[uniqueIdentifier];
            }
        } else {
            Object.keys(existingSubscriptions).forEach(key => {
                existingSubscriptions[key]();
            });
            delete routeSubscriptions[route.toString()];
        }
    }
}

function isFirestoreQuery(arg: any): arg is firestore.Query {
    return arg.onSnapshot !== undefined;
}

function isFirestoreDocumentRefernce(arg: any): arg is firestore.DocumentReference {
    return arg.onSnapshot !== undefined;
}

type SubscribeArgs = {
    model: any;
    store: DS.Store;
    modelName: never;
    modelClass: never;
    uniqueIdentifier: any;
    serializer: any;
    adapter: never;
}

type FirestoreQueryArgs = {
    query: firestore.Query | firestore.CollectionReference
} & SubscribeArgs

type RealtimeDatabaseQueryArgs = {
    ref: database.Reference
} & SubscribeArgs

export default class RealtimeListenerService extends Service.extend({

    routeSubscriptions: {} as {[key:string]: {[key:string]: () => void}}

}) {

    subscribe(route: Object, model: any) {
        const store = model.store as DS.Store;
        const modelName = (model.modelName || model.get('_internalModel.modelName')) as never
        const modelClass = store.modelFor(modelName);
        const query = model.get('meta.query') as firestore.Query|database.Reference|undefined;
        const ref = model.get('_internalModel._recordData._data._ref') as firestore.DocumentReference|database.Reference|undefined;
        const uniqueIdentifier = model.toString();
        const serializer = store.serializerFor(modelName) as any; // TODO type
        const adapter = store.adapterFor(modelName);
        const args = { model, store, modelName, modelClass, uniqueIdentifier, serializer, adapter };
        if (query) {
            if (isFirestoreQuery(query)) {
                // Firestore query
                const unsubscribe = runFirestoreCollectionListener({query, ...args});
                setRouteSubscription(this, route, uniqueIdentifier, unsubscribe);
            } else {
                // RTDB query
                const unsubscribe = runRealtimeDatabaseListListener({ref: query, ...args});
                setRouteSubscription(this, route, uniqueIdentifier, unsubscribe);
            }
        } else if (ref) {
            if (isFirestoreDocumentRefernce(ref)) {
                // Firestore find
                const unsubscribe = ref.onSnapshot(doc => {
                    run(() => {
                        const normalizedData = serializer.normalizeSingleResponse(store, modelClass, doc);
                        store.push(normalizedData);
                    });
                });
                setRouteSubscription(this, route, uniqueIdentifier, unsubscribe);
            } else {
                // RTDB find
                const listener = ref.on('value', snapshot => {
                    run(() => {
                        if (snapshot) {
                            if (snapshot.exists()) {
                                const normalizedData = serializer.normalizeSingleResponse(store, modelClass, snapshot);
                                store.push(normalizedData);
                            } else {
                                const record = store.findRecord(modelName, snapshot.key!)
                                if (record) { store.deleteRecord(record) }
                            }
                        }
                    });
                });
                const unsubscribe = () => ref.off('value', listener);
                setRouteSubscription(this, route, uniqueIdentifier, unsubscribe);
            }
        } else {
            // findAll ditches the metadata :(
            if (serializer.constructor.name == 'FirestoreSerializer') {
                // Firestore findAll
                firestoreRootCollection(adapter, modelName).then(query => {
                    const unsubscribe = runFirestoreCollectionListener({query, ...args});
                    setRouteSubscription(this, route, uniqueIdentifier, unsubscribe);
                });
            } else if (serializer.constructor.name == 'RealtimeDatabaseSerializer') {
                // RTDB findAll
                realtimeDatabaseRootCollection(adapter, modelName).then(ref => {
                    const unsubscribe = runRealtimeDatabaseListListener({ref, ...args});
                    setRouteSubscription(this, route, uniqueIdentifier, unsubscribe);
                });
            }
        }
    }

    unsubscribe(route: Object, model?: DS.Model) {
        unsubscribeRoute(this, route, model && model.toString());
    }

}

const runFirestoreCollectionListener = ({query, model, store, serializer, modelClass}: FirestoreQueryArgs) => {
    const unsubscribe = query.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => run(() => {
            const normalizedData = serializer.normalizeSingleResponse(store, modelClass, change.doc);
            switch(change.type) {
                case 'added': {
                    const current = model.content.objectAt(change.newIndex);
                    if (current == null || current.id !== change.doc.id ) {
                        const doc = store.push(normalizedData) as any;
                        model.content.insertAt(change.newIndex, doc._internalModel);
                    }
                    break;
                }
                case 'modified': {
                    const current = model.content.objectAt(change.oldIndex);
                    if (current == null || current.id == change.doc.id) {
                        if (change.newIndex !== change.oldIndex) {
                            model.content.removeAt(change.oldIndex);
                            model.content.insertAt(change.newIndex, current)
                        }
                    }
                    store.push(normalizedData);
                    break;
                }
                case 'removed': {
                    const current = model.content.objectAt(change.oldIndex);
                    if (current && current.id == change.doc.id) {
                        model.content.removeAt(change.oldIndex);
                    }
                    break;
                }
            }
        }))
    });
    return unsubscribe;
}

const runRealtimeDatabaseListListener = ({model, ref, serializer, store, modelClass}: RealtimeDatabaseQueryArgs) => {
    const onChildAdded = ref.on('child_added', (snapshot, priorKey) => {
        run(() => {
            if (snapshot) {
                const normalizedData = serializer.normalizeSingleResponse(store, modelClass, snapshot);
                const doc = store.push(normalizedData) as any;
                const existing = model.content.find((record:any) => record.id === doc.id);
                if (existing) { model.content.removeObject(existing); }
                let insertIndex = 0;
                if (priorKey) {
                    const record = model.content.find((record:any) => record.id === priorKey);
                    insertIndex = model.content.indexOf(record) + 1;
                }
                const current = model.content.objectAt(insertIndex);
                if (current == null || current.id !== doc.id ) {
                    model.content.insertAt(insertIndex, doc._internalModel);
                }
            }
        });
    });
    const onChildRemoved = ref.on('child_removed', snapshot => {
        run(() => {
            if (snapshot) {
                const record = model.content.find((record:any) => record.id === snapshot.key)
                if (record) { model.content.removeObject(record); }
            }
        });
    });
    const onChildChanged = ref.on('child_changed', snapshot => {
        run(() => {
            if (snapshot) {
                const normalizedData = serializer.normalizeSingleResponse(store, modelClass, snapshot);
                store.push(normalizedData);
            }
        });
    });
    const onChildMoved = ref.on('child_moved', (snapshot, priorKey) => {
        run(() => {
            if (snapshot) {
                const normalizedData = serializer.normalizeSingleResponse(store, modelClass, snapshot);
                const doc = store.push(normalizedData) as any;
                const existing = model.content.find((record:any) => record.id === doc.id);
                if (existing) { model.content.removeObject(existing); }
                if (priorKey) {
                    const record = model.content.find((record:any) => record.id === priorKey);
                    const index = model.content.indexOf(record);
                    model.content.insertAt(index+1, doc._internalModel);
                } else {
                    model.content.insertAt(0, doc._internalModel);
                }
            }
        });
    });
    const unsubscribe = () => {
        ref.off('child_added', onChildAdded);
        ref.off('child_removed', onChildRemoved);
        ref.off('child_changed', onChildChanged);
        ref.off('child_moved', onChildMoved);
    }
    return unsubscribe;
}

declare module '@ember/service' {
    interface Registry {
      "realtime-listener": RealtimeListenerService;
    }
}