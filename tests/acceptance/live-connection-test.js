import { expect } from 'chai';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

import {
  describe,
  it,
  beforeEach,
  afterEach,
} from 'mocha';

describe('Acceptance: live firebase connection', function () {
  beforeEach(function () {
    this.application = startApp();
  });

  afterEach(function () {
    destroyApp(this.application);
  });

  it('handles live connections in testing', function () {
    visit('/posts');

    andThen(function () {
      expect(currentPath()).to.equal('posts.index');
      expect(find('.post-slug').length).to.equal(20);
    });
  });
});
