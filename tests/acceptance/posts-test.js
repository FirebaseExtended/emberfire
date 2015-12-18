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

describe('Acceptance: /posts', function() {
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

  it('can visit /posts', function() {
    visit('/posts');

    andThen(function() {
      expect(currentPath()).to.equal('posts.index');
    });
  });

  it('shows only the latest 20 results', function() {
    visit('/posts');

    andThen(function() {
      expect(find('.post-slug').length).to.equal(20);
    });
  });

  it('shows latest post first', function() {
    visit('/posts');

    andThen(function() {
      expect(find('.post-slug-title:first a').text().trim()).to.equal('Post 21');
    });
  });

  it('shows second post last', function() {
    visit('/posts');

    andThen(function() {
      expect(find('.post-slug-title:last a').text().trim()).to.equal('Post 2');
    });
  });

  it('links to each post', function() {
    visit('/posts');

    andThen(function() {
      expect(find('.post-slug-title:first a').attr('href')).to.equal('/post/post_21');
    });
  });

  it('navigates to the correct route, when clicking on a post link', function() {
    visit('/posts');
    click('.post-slug-title:first a');

    andThen(function() {
      expect(currentPath()).to.equal('post');
    });
  });
});
