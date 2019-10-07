import Service from '@ember/service';
import { getOwner } from '@ember/application';
import DS from 'ember-data';
import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { firestore, database } from 'firebase/app';

// TODO don't hardcode these, but having trouble otherwise
import { normalize as firestoreNormalize } from '../serializers/firestore';
import { normalize as databaseNormalize } from '../serializers/realtime-database';

const getService = (object:Object) => getOwner(object).lookup('service:realtime-listener') as RealtimeListenerService;
const isFastboot = (object:Object) => {
    const fastboot = getOwner(object).lookup('service:fastboot');
    return fastboot && fastboot.isFastBoot;
}

export const subscribe = (route: Object, model: DS.Model) => !isFastboot(route) && getService(route).subscribe(route, model);
export const unsubscribe = (route: Object) => !isFastboot(route) && getService(route).unsubscribe(route);

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

    subscribe(route: Object, model: any) {
        const store = model.store as DS.Store;
        const modelName = (model.modelName || model.get('_internalModel.modelName')) as never
        const modelClass = store.modelFor(modelName);
        const query = model.get('meta.query') as firestore.Query|database.Reference|undefined;
        const ref = model.get('_internalModel._recordData._data._ref') as firestore.DocumentReference|database.Reference|undefined;
        const uniqueIdentifier = model.toString();
        if (query) {
            if (isFirestoreQuery(query)) {
                const unsubscribe = query.onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => run(() => {
                        const normalizedData = firestoreNormalize(store, modelClass, change.doc);
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
                setRouteSubscription(this, route, uniqueIdentifier, unsubscribe);
            } else {
                const onChildAdded = query.on('child_added', (snapshot, priorKey) => {
                    run(() => {
                        if (snapshot) {
                            const normalizedData = databaseNormalize(store, modelClass, snapshot);
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
                const onChildRemoved = query.on('child_removed', snapshot => {
                    run(() => {
                        if (snapshot) {
                            const record = model.content.find((record:any) => record.id === snapshot.key)
                            if (record) { model.content.removeObject(record); }
                        }
                    });
                });
                const onChildChanged = query.on('child_changed', snapshot => {
                    run(() => {
                        if (snapshot) {
                            const normalizedData = databaseNormalize(store, modelClass, snapshot);
                            store.push(normalizedData);
                        }
                    });
                });
                const onChildMoved = query.on('child_moved', (snapshot, priorKey) => {
                    run(() => {
                        if (snapshot) {
                            const normalizedData = databaseNormalize(store, modelClass, snapshot);
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
                    query.off('child_added', onChildAdded);
                    query.off('child_removed', onChildRemoved);
                    query.off('child_changed', onChildChanged);
                    query.off('child_moved', onChildMoved);
                }
                setRouteSubscription(this, route, uniqueIdentifier, unsubscribe);
            }
        } else if (ref) {
            if (isFirestoreDocumentRefernce(ref)) {
                const unsubscribe = ref.onSnapshot(doc => {
                    run(() => {
                        const normalizedData = firestoreNormalize(store, modelClass, doc);
                        store.push(normalizedData);
                    });
                });
                setRouteSubscription(this, route, uniqueIdentifier, unsubscribe);
            } else {
                const listener = ref.on('value', snapshot => {
                    run(() => {
                        if (snapshot) {
                            if (snapshot.exists()) {
                                const normalizedData = databaseNormalize(store, modelClass, snapshot);
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