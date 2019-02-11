import Route from '@ember/routing/route';
import RealtimeRouteMixin from 'emberfire/mixins/realtime-route';
import { inject as service } from '@ember/service';
import RSVP, { reject } from 'rsvp';

export default Route.extend(RealtimeRouteMixin, {
    firebaseApp: service(),
    model() {
        return this.firebaseApp.auth().then(({currentUser}) => 
            currentUser && this.store.query('comment', { filter: { user: currentUser.uid } }) || reject()
        );
    }
})