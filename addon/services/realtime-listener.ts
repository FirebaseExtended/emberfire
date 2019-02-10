import Service from '@ember/service';
import { getOwner } from '@ember/application';
import DS from 'ember-data';
import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { firestore } from 'firebase/app';

const getService = (object:Object) => getOwner(object).lookup('service:realtime-listener') as RealtimeListenerService;
const isFastboot = (object:Object) => {
    const fastboot = getOwner(object).lookup('service:fastboot');
    return fastboot && fastboot.isFastBoot;
}

export const subscribe = (route: Object, model: DS.Model) => !isFastboot(route) && getService(route).subscribe(route, model);
export const unsubscribe = (route: Object) => !isFastboot(route) && getService(route).unsubscribe(route);

const setRouteSubscription = (service: RealtimeListenerService, route: Object, unsubscribe: (() => void)|null) => {
    const routeSubscriptions = get(service, `routeSubscriptions`);
    const existingSubscription = get(routeSubscriptions, route.toString());
    if (existingSubscription) { existingSubscription() }
    if (unsubscribe) {
        routeSubscriptions[route.toString()] = unsubscribe;
    } else {
        delete routeSubscriptions[route.toString()];
    }
}

export default class RealtimeListenerService extends Service.extend({

    routeSubscriptions: {} as {[key:string]: () => void}

}) {

    subscribe(route: Object, model: any) {
        const store = model.store as DS.Store;
        const modelName = (model.modelName || model.get('_internalModel.modelName')) as never
        const query = model.get('meta.query') as firestore.Query|undefined;
        const ref = model.get('_internalModel._recordData._data._ref') as firestore.DocumentReference|undefined;
        if (query) {
            const unsubscribe = query.onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => run(() => {
                    const normalizedData = store.normalize(modelName, change.doc);
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
            setRouteSubscription(this, route, unsubscribe);
        } else if (ref) {
            const unsubscribe = ref.onSnapshot(doc => {
                run(() => {
                    const normalizedData = store.normalize(modelName, doc);
                    store.push(normalizedData);
                });
            });
            setRouteSubscription(this, route, unsubscribe);
        }
    }

    unsubscribe(route: Object) {
        setRouteSubscription(this, route, null);
    }

}

declare module '@ember/service' {
    interface Registry {
      "realtime-listener": RealtimeListenerService;
    }
}