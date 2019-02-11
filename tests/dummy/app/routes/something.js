import Route from '@ember/routing/route';
import { subscribe, unsubscribe } from 'emberfire/services/realtime-listener';

export default Route.extend({
    model(params) {
        return this.store.queryRecord('something', {
            doc: ref => ref.doc(params.id),
            include: ['comments,comments.user']
        });
    },
    afterModel(model) {
        subscribe(this, model);
    },
    deactivate() {
        unsubscribe(this);
    }
});