import Route from '@ember/routing/route';
import RealtimeRouteMixin from 'emberfire/mixins/realtime-route';

export default Route.extend(RealtimeRouteMixin, {
    model() {
        return this.store.query('comment', ref => ref.orderByChild('body'));
    }
})