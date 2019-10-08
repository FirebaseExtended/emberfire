import Route from '@ember/routing/route';
import RealtimeRouteMixin from 'emberfire/mixins/realtime-route';
import { inject as service } from '@ember/service';

export default Route.extend(RealtimeRouteMixin, {
    firebaseApp: service(),
    model() {
        return this.firebaseApp.auth().then(({currentUser}) => 
            currentUser &&
                this.store.query('comment', { filter: { user: currentUser.uid }, include: 'user' }) ||
                this.store.query('comment', { include: 'user'} )
        );
    }
})  