import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { performance } from 'firebase';
import { reject } from 'rsvp';

export default Mixin.create({
    firebaseApp: service('firebase-app'),
    store: service('store') as any,
    router: service('router'),
    trace: reject() as Promise<performance.Trace>,
    init() {
        this._super(...arguments);
        this.get('firebaseApp').performance();
        // TODO see if I can fix this
        if (this.toString().indexOf("@route:application::") > 0) { throw "PerformanceRouteMixin does not work correctly in the application route" }
    },
    beforeModel() {
        this.set('trace', this.get('firebaseApp').performance().then(perf => {
            const trace = perf.trace(`${this.toString()}:didTransition`);
            trace.start();
            return trace;
        }));
    },
    routeDidChange() {
        const router = this.get('router');
        router.removeObserver('currentRoute', this, this.routeDidChange);
        const screen_name = router.currentRoute.name;
        this.get('trace').then(trace => {
            trace.putAttribute('url', router.currentURL);
            // TODO allow name to be set
            (trace as any).name = `${screen_name}:didTransition`;
            trace.stop();
            this.set('trace', reject());
        });
    },
    afterModel() {
        const router = this.get('router');
        router.addObserver('currentRoute', this, this.routeDidChange);
    }
});