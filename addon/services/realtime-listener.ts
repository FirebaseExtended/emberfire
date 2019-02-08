import Service from '@ember/service';
import Mixin from '@ember/object/mixin';
import { getOwner } from '@ember/application';
import DS from 'ember-data';
import { get } from '@ember/object';
import { run } from '@ember/runloop';
import { firestore } from 'firebase/app';
import { normalize } from '../serializers/firestore';

export const RealtimeRouteMixin = Mixin.create({
    afterModel(model:DS.Model) {
        subscribe(this, model);
    },
    deactivate() {
        unsubscribe(this);
    }
});

const service = (owner:Object) => getOwner(owner).lookup('service:realtime-listener') as RealtimeListenerService;

const isFastboot = (owner:Object) => {
    const fastboot = getOwner(owner).lookup('service:fastboot');
    return fastboot != null && fastboot.isFastBoot;
}

const hasProperMeta = (model: any) => {
    const meta = model.get('meta');
    return meta && meta.query; // TODO handle docs
}

export const subscribe = (route: Object, model: DS.Model) => !isFastboot(route) && hasProperMeta(model) && service(route).subscribe(route, model);
export const unsubscribe = (route: Object) => !isFastboot(route) && service(route).unsubscribe(route);

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
        const store = model.store as DS.Store;
        const modelName = model.modelName as never;
        const unsubscribe = meta.query.onSnapshot((snapshot:firestore.QuerySnapshot) => {
            snapshot.docChanges().forEach(change => run(() => {
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