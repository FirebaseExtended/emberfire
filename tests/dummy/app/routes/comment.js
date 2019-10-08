import Route from '@ember/routing/route';
import RealtimeRouteMixin from 'emberfire/mixins/realtime-route';

export default Route.extend(RealtimeRouteMixin, {
    model(params) {
        return this.store.findRecord('comment', params.id, { include: 'user' });
    }
})