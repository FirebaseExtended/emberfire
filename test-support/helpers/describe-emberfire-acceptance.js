import {
  afterEach,
  beforeEach,
  describe
} from 'mocha';

import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

import stubFirebase from '../helpers/stub-firebase';
import unstubFirebase from '../helpers/unstub-firebase';
import createOfflineRef from '../helpers/create-offline-ref';
import replaceAppRef from '../helpers/replace-app-ref';

export default function describeEmberfireAcceptance(title, testsOrOptions, tests) {
  let options;

  if (typeof testsOrOptions == 'function') {
    tests = testsOrOptions;
    options = {};
  } else {
    options = testsOrOptions;
  }

  let fixtureData = options.fixtureData || {};

  describe(title, function() {

    beforeEach(function() {
      stubFirebase();
      this.application = startApp();
      this.ref = createOfflineRef(fixtureData);
      replaceAppRef(this.application, this.ref);
    });

    afterEach(function() {
      destroyApp(this.application);
      this.application = null;
      unstubFirebase();
    });

    tests();
  });
}
