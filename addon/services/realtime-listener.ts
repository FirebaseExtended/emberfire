import Service from '@ember/service';
import { getOwner } from '@ember/application';
import DS from 'ember-data';
import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { firestore } from 'firebase/app';
import { normalize } from '../serializers/firestore';

const getService = (object:Object) => getOwner(object).lookup('service:realtime-listener') as RealtimeListenerService;
const isFastboot = (object:Object) => {
    const fastboot = getOwner(object).lookup('service:fastboot');
    return fastboot && fastboot.isFastBoot;
}

// TODO kill this once subscribe has proper type checks
const hasProperMeta = (model: any) => {
    const meta = model.get('meta');
    // TODO handle queryRecord
    return meta && (meta.query || meta.ref) || console.warn('Realtime listeners only work for models returned from FirestoreAdapter query and queryRecord.');
}

export const subscribe = (route: Object, model: DS.Model) => !isFastboot(route) && hasProperMeta(model) && getService(route).subscribe(route, model);
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
        const meta = model.get('meta');
        const store = model.store as DS.Store; // TODO type model?
        const modelName = model.modelName as never; // TODO add K so drop never
        const query = meta.query as firestore.Query|undefined;
        const ref = meta.ref as firestore.DocumentReference|undefined;
        // TODO typecheck Firestore queryRecord ref and RTDB ref
        if (query) {
            console.log("query listener", route, query);
            const unsubscribe = query.onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => run(() => {
                    // normalize should come from the right serializer, not hardcode
                    const normalizedData = normalize(store, store.modelFor(modelName), change.doc);
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
            console.log("doc listener", route, ref);
            const unsubscribe = ref.onSnapshot(doc => {
                const normalizedData = normalize(store, store.modelFor(modelName), doc);
                store.push(normalizedData);
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