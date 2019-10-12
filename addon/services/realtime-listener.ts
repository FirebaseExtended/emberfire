import Service from '@ember/service';
import { getOwner } from '@ember/application';
import DS from 'ember-data';
import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { firestore, database } from 'firebase/app';

// TODO don't hardcode these, but having trouble otherwise
import { rootCollection as firestoreRootCollection } from '../adapters/firestore';
import { rootCollection as realtimeDatabaseRootCollection } from '../adapters/realtime-database';
import { resolve } from 'rsvp';

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

export default class RealtimeListenerService extends Service.extend({

    routeSubscriptions: {} as {[key:string]: {[key:string]: () => void}}

}) {

    subscribe(route: Object, model: any, parentModel?: any, relationship?:any) {
        if (!model) { return }
        const store = model.store as DS.Store;
        const modelName = (model.get('type.modelName') || model.get('_internalModel.modelName') || model.modelName) as never
        const modelClass = store.modelFor(modelName) as any;
        const ref = (model.get('meta._ref') || model.get('_recordData._data._ref') || model.get('_internalModel._recordData._data._ref')) as firestore.DocumentReference|database.Reference|undefined;
        const uniqueIdentifier = model.toString();
        const serializer = store.serializerFor(modelName) as any; // TODO type
        const adapter = store.adapterFor(modelName);
        const observeRelationships = (internalModel: any) => {
            // HACK HACK HACK
            const movedKey = '__original___updatePromiseProxyFor';
            const proxyPromiseListenersKey = `_updatePromiseProxyListeners`;
            const requestedRelationshipsKey = '_requestedRelationships';
            if (!internalModel[requestedRelationshipsKey]) { internalModel[requestedRelationshipsKey] = [] }
            const movedMethod = internalModel[movedKey];
            if (!movedMethod) {
                internalModel[movedKey] = internalModel._updatePromiseProxyFor;
                internalModel[proxyPromiseListenersKey] = [];
                internalModel._updatePromiseProxyFor = ((kind: string, key: string, args: Object) => {
                    const proxy = internalModel[movedKey](kind, key, args);
                    proxy.then((result:any) => {
                        if (internalModel[requestedRelationshipsKey].indexOf(key) < 0) {
                            internalModel[requestedRelationshipsKey] = [...internalModel[requestedRelationshipsKey], key];
                            internalModel[proxyPromiseListenersKey].forEach((f:any) => f(kind, key, args, result));
                        }
                    });
                    return proxy;
                })
            }
            internalModel[proxyPromiseListenersKey] = [
                ...internalModel[proxyPromiseListenersKey],
                ((kind: string, key: string, args: Object, result: any) => {
                    const triggerdRelationship = modelClass.relationshipsObject[key];
                    this.subscribe(route, result, model, triggerdRelationship);
                })
            ];
        }
        let content = model.content || parentModel && get(parentModel, `${relationship.key}.content`);
        if (model._internalModel) {
            observeRelationships(model._internalModel);
        } else if (content) { // TODO find backing content for hasMany
            content.forEach((internalModel:any) => {
                observeRelationships(internalModel);
            });
        }
        if (ref) {
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
            if (serializer.constructor.name == 'FirestoreSerializer') {
                // Firestore findAll
                const query = model.get('meta.query') as firestore.Query|undefined;
                const queryOrRoot = query && resolve(query) || firestoreRootCollection(adapter, modelName);
                queryOrRoot.then(query => {
                    const unsubscribe = query.onSnapshot(snapshot => {
                        snapshot.docChanges().forEach(change => run(() => {
                            const normalizedData = serializer.normalizeSingleResponse(store, modelClass, change.doc);
                            switch(change.type) {
                                case 'added': {
                                    const current = content.objectAt(change.newIndex);
                                    if (current == null || current.id !== change.doc.id ) {
                                        const doc = store.push(normalizedData) as any;
                                        content.insertAt(change.newIndex, doc._internalModel);
                                    }
                                    break;
                                }
                                case 'modified': {
                                    const current = content.objectAt(change.oldIndex);
                                    if (current == null || current.id == change.doc.id) {
                                        if (change.newIndex !== change.oldIndex) {
                                            content.removeAt(change.oldIndex);
                                            content.insertAt(change.newIndex, current)
                                        }
                                    }
                                    store.push(normalizedData);
                                    break;
                                }
                                case 'removed': {
                                    const current = content.objectAt(change.oldIndex);
                                    if (current && current.id == change.doc.id) {
                                        content.removeAt(change.oldIndex);
                                    }
                                    break;
                                }
                            }
                        }))
                    });
                    setRouteSubscription(this, route, uniqueIdentifier, unsubscribe);
                });
            } else if (serializer.constructor.name == 'RealtimeDatabaseSerializer') {
                // RTDB findAll
                const ref = (model.get('meta.query') || model.get('recordData._data._ref')) as database.Reference|undefined;
                const refOrRoot = ref ? resolve(ref) : realtimeDatabaseRootCollection(adapter, modelName);
                refOrRoot.then(ref => {
                    const onChildAdded = ref.on('child_added', (snapshot, priorKey) => {
                        run(() => {
                            if (snapshot) {
                                const normalizedData = serializer.normalizeSingleResponse(store, modelClass, snapshot);
                                const doc = store.push(normalizedData) as any;
                                const existing = content.find((record:any) => record.id === doc.id);
                                if (existing) { content.removeObject(existing); }
                                let insertIndex = 0;
                                if (priorKey) {
                                    const record = content.find((record:any) => record.id === priorKey);
                                    insertIndex = content.indexOf(record) + 1;
                                }
                                const current = content.objectAt(insertIndex);
                                if (current == null || current.id !== doc.id ) {
                                    content.insertAt(insertIndex, doc._internalModel);
                                }
                            }
                        });
                    });
                    const onChildRemoved = ref.on('child_removed', snapshot => {
                        run(() => {
                            if (snapshot) {
                                const record = content.find((record:any) => record.id === snapshot.key)
                                if (record) { content.removeObject(record); }
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
                                const existing = content.find((record:any) => record.id === doc.id);
                                if (existing) { content.removeObject(existing); }
                                if (priorKey) {
                                    const record = content.find((record:any) => record.id === priorKey);
                                    const index = content.indexOf(record);
                                    content.insertAt(index+1, doc._internalModel);
                                } else {
                                    content.insertAt(0, doc._internalModel);
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
                    setRouteSubscription(this, route, uniqueIdentifier, unsubscribe);
                });
            }
        }
    }

    unsubscribe(route: Object, model?: DS.Model) {
        unsubscribeRoute(this, route, model && model.toString());
    }

}

declare module '@ember/service' {
    interface Registry {
      "realtime-listener": RealtimeListenerService;
    }
}