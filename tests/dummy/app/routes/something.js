import Route from '@ember/routing/route';
import RealtimeRouteMixin from 'emberfire/mixins/realtime-route';
import { subscribe, unsubscribe } from 'emberfire/services/realtime-listener';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { resolve } from 'rsvp';

export default Route.extend(RealtimeRouteMixin, {
    store: service(),
    firebaseApp: service(),
    model(params) {
        return this.store.query('comment', { filter: { something: params.id }, include: 'user,something'});
    },
    actions: {
        createComment() {
            const store = get(this, 'store');
            const somethingId = get(this, 'context.query.filter.something');
            const profile = get(this, 'firebaseApp').auth().then(({currentUser}) => currentUser && store.findRecord('user', currentUser.uid) || null);
            Promise.all([
                profile,
                store.findRecord('something', somethingId),
            ]).then(([user, something]) => {
                return store.createRecord('comment', {
                    body: 'test',
                    user,
                    something
                });
            }).then(it => {
                it.save();
            }, reason => {
                console.error(reason);
            });
        }
    }
});