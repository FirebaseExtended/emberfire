import Route from '@ember/routing/route';
import RealtimeRouteMixin from 'emberfire/mixins/realtime-route';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import PerformanceRouteMixin from 'emberfire/mixins/performance-route';

export default Route.extend(RealtimeRouteMixin, PerformanceRouteMixin, {
  store: service(),
  firebaseApp: service(),
  model(params) {
    return this.store.findRecord('something', params.id, { include: 'user' });
  },
  actions: {
    createComment() {
      const store = this.store;
      const something = this.context;
      const profile = this.firebaseApp
        .auth()
        .then(
          ({ currentUser }) =>
            (currentUser && store.findRecord('user', currentUser.uid)) || null
        );
      profile
        .then((user) => {
          return store.createRecord('comment', {
            body: 'test',
            user,
            something,
          });
        })
        .then(
          (it) => {
            it.save();
          },
          (reason) => {
            console.error(reason);
          }
        );
    },
  },
});
