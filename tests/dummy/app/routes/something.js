import Ember from 'ember';
import Route from '@ember/routing/route';

const { inject: { service } } = Ember;

export default Route.extend({
    model(params) {
        return this.store.findRecord('something', params.id)
    },
    afterModel(model) {
        // start the listener
    },
    deactivate() {
        // stop the listener
    }
});