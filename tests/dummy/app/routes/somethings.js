import Ember from 'ember';
import Route from '@ember/routing/route';

const { inject: { service } } = Ember;

export default Route.extend({
    model() {
        return this.store.query('something', ref => ref.orderBy('title').limit(3));
    },
    afterModel(model) {
        // start the listener
    },
    deactivate() {
        // stop the listener
    }
})