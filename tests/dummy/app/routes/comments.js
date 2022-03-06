import Route from '@ember/routing/route';
import RealtimeRouteMixin from 'emberfire/mixins/realtime-route';
import { inject as service } from '@ember/service';
import PerformanceRouteMixin from 'emberfire/mixins/performance-route';

export default Route.extend(RealtimeRouteMixin, PerformanceRouteMixin, {
  firebaseApp: service(),
  model() {
    return this.firebaseApp.auth().then(
      ({ currentUser }) =>
        (currentUser &&
          this.store.query('comment', {
            filter: { user: currentUser.uid },
          })) ||
        this.store.query('comment', {})
    );
  },
});
