import moduleForAcceptance from './module-for-acceptance';

import createOfflineRef from './create-offline-ref';
import replaceAppRef from './replace-app-ref';
import stubFirebase from './stub-firebase';
import unstubFirebase from './unstub-firebase';

export default function(name, options = {}) {
  let fixtureData = options.fixtureData || {};
  moduleForAcceptance(name, {
    beforeEach() {
      stubFirebase();
      this.ref = createOfflineRef(fixtureData);
      replaceAppRef(this.application, this.ref);

      if (options.beforeEach) {
        options.beforeEach.apply(this, arguments);
      }
    },

    afterEach() {
      if (options.afterEach) {
        options.afterEach.apply(this, arguments);
      }

      unstubFirebase();
    }
  });
}
