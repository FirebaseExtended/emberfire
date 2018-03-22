import Route from '@ember/routing/route';

export default Route.extend({
    model() {
        return this.store.query('something', ref => ref.orderBy('title').limit(3));
    }
})