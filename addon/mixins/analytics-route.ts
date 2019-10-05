import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { getOwner } from '@ember/application';

export default Mixin.create({
    firebaseApp: service('firebase-app'),
    router: service('router'),
    init() {
        this._super(...arguments);
        const config = getOwner(this).resolveRegistration('config:environment');
        const router = get(this, 'router');
        router.on('routeDidChange', () => {
            const firebase = get(this, 'firebaseApp');
            const app_name = config.APP.name || 'Ember App';
            const app_version = config.APP.version || undefined;
            const screen_name = router.currentRouteName;
            const url = router.currentURL;
            firebase.analytics().then(analytics => {
                analytics.setCurrentScreen(screen_name || url, { global: true });
                analytics.logEvent("screen_view", { app_name, screen_name, url, app_version });
            });
        })
    }
});