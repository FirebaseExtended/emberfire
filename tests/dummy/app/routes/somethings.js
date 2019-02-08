import Route from '@ember/routing/route';
import { RealtimeRouteMixin } from 'emberfire/services/realtime-listener';

export default Route.extend(RealtimeRouteMixin, {
    model() {
        return this.store.query('something', ref => ref.orderBy('title'));
    }
})