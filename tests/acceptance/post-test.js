/* jshint expr:true */
import {
  describe,
  it,
  beforeEach,
  afterEach
} from 'mocha';
import { expect } from 'chai';
import Ember from 'ember';
import startApp from '../helpers/start-app';
import stubFirebase from '../helpers/stub-firebase';
import unstubFirebase from '../helpers/unstub-firebase';
import createTestRef from '../helpers/create-test-ref';

describe('Acceptance: /post/post_21', function() {
  var application, ref;

  beforeEach(function() {
    stubFirebase();
    application = startApp();
    ref = createTestRef('acceptance');

    var store = application.__container__.lookup('service:store');
    var adapter = store.adapterFor('application');
    adapter._ref = ref;
    adapter._queueFlushDelay = false;
  });

  afterEach(function() {
    unstubFirebase();
    Ember.run(application, 'destroy');
  });

  it('can visit /post/post_21', function() {
    visit('/post/post_21');

    andThen(function() {
      expect(currentPath()).to.equal('post');
    });
  });

  it('shows the post author', function(done) {
    visit('/post/post_21');

    andThen(function() {
      expect(find('.post-author').text().trim()).to.equal('tstirrat');
    });
  });

  it('shows the post date', function() {
    visit('/post/post_21');

    andThen(function() {
      expect(find('.post-date').text().trim()).to.equal('March 21st, 2014');
    });
  });
});
