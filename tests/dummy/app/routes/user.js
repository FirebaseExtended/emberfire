import Route from '@ember/routing/route';
import RealtimeRouteMixin from 'emberfire/mixins/realtime-route';
import PerformanceRouteMixin from 'emberfire/mixins/performance-route';

export default Route.extend(RealtimeRouteMixin, PerformanceRouteMixin, {
    model(params) {
        return this.store.findRecord('user', params.id);
    }
});