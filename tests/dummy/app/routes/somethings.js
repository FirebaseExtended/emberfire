import Route from '@ember/routing/route';
import RealtimeRouteMixin from 'emberfire/mixins/realtime-route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend(RealtimeRouteMixin, {
    store: service(),
    firebaseApp: service(),
    model() {
        return this.store.query('something', { orderBy: 'title', include: 'user' });
    },
    actions: {
        createSomething() {
            const store = get(this, 'store');
            const profile = get(this, 'firebaseApp').auth().then(({currentUser}) => currentUser && store.findRecord('user', currentUser.uid) || null);
            profile.then(user => store.createRecord('something', {
                title: 'test',
                description: 'test',
                user
            })).then(it => {
                it.save();
            }, reason => {
                console.error(reason);
            });
        }
    }
})