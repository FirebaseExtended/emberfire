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
        return this.store.findRecord('something', params.id);
    },
    actions: {
        createComment() {
            const store = get(this, 'store');
            const something = get(this, 'context');
            const profile = get(this, 'firebaseApp').auth().then(({currentUser}) => currentUser && store.findRecord('user', currentUser.uid) || null);
            profile.then((user) => {
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