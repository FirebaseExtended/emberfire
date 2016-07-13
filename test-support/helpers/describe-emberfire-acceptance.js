import {
  afterEach,
  beforeEach,
  describe
} from 'mocha';

import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

import stubFirebase from '../helpers/stub-firebase';
import unstubFirebase from '../helpers/unstub-firebase';
import createTestRef from '../helpers/create-test-ref';
import replaceAppRef from '../helpers/replace-app-ref';

export default function describeEmberfireAcceptance(title, tests) {
  describe(title, function() {
    let application;

    beforeEach(function() {
      stubFirebase();
      application = startApp();
      this.ref = createTestRef('acceptance')
      replaceAppRef(application, this.ref);
    });

    afterEach(function() {
      destroyApp(application);
      unstubFirebase();
    });

    tests();
  });
}
