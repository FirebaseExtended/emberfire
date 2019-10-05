import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Mixin.create({
    analyticsAppName: null as string|null,
    analyticsAppVersion: null as string|null,
    firebaseApp: service('firebase-app'),
    router: service('router'),
    init() {
        this._super(...arguments);
        const router = get(this, 'router');
        router.on('routeDidChange', () => {
            const firebase = get(this, 'firebaseApp');
            const app_name = get(this, 'analyticsAppName') || 'Ember App';
            const app_version = get(this, 'analyticsAppVersion') || undefined;
            const screen_name = router.currentRouteName || undefined;
            const url = router.currentURL;
            firebase.analytics().then(analytics => {
                analytics.logEvent("screen_view", { app_name, screen_name, url, app_version });
            });
        })
    }
});