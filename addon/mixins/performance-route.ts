import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { performance } from 'firebase';
import { Promise, reject } from 'rsvp';

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
        // TODO promise proxy
        this.set('trace', this.get('firebaseApp').performance().then(perf => {
            const trace = perf.trace(`${this.toString()}:didTransition`);
            trace.start();
            return trace;
        }));
    },
    afterModel() {
        const tracePromise = this.get('trace')!;
        const router = this.get('router');
        tracePromise.then((trace:performance.Trace|undefined) => {
            // TODO figure out how to disconnect the routeDidChange listener
            router.on('routeDidChange', () => {
                if (trace) {
                    const screen_name = router.currentRouteName;
                    trace.putAttribute('url', router.currentURL);
                    (trace as any).name = `${screen_name}:didTransition`;
                    trace.stop();
                    this.set('trace', reject());
                    trace = undefined;
                }
            });
        })
    }
});