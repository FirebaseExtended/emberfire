/* jshint expr:true */
import {
  describe,
  it,
  beforeEach,
  afterEach
} from 'mocha';
import { expect } from 'chai';
import startApp from '../../helpers/start-app';
import destroyApp from '../../helpers/destroy-app';
import replaceAppRef from '../../helpers/replace-app-ref';
import stubFirebase from '../../helpers/stub-firebase';
import unstubFirebase from '../../helpers/unstub-firebase';
import createTestRef from '../../helpers/create-test-ref';

describe('Acceptance: /posts/new', function() {
  var application, ref;

  beforeEach(function() {
    stubFirebase();
    application = startApp();
    ref = createTestRef('acceptance');

    replaceAppRef(application, ref);
  });

  afterEach(function() {
    unstubFirebase();
    destroyApp(application);
  });

  it('can visit /posts/new', function() {
    visit('/posts/new');

    andThen(function() {
      expect(currentPath()).to.equal('posts.new');
    });
  });

  describe('creating a new post', function() {

    beforeEach(() => {
      visit('/posts/new');
      fillIn('.post-publish [placeholder=Title]', 'AAA');
      fillIn('.post-publish [placeholder=Username]', 'kanyewest');
      fillIn('.post-publish [placeholder=Body]', 'things');
      click('.post-publish button');
    });

    it('navigates to the new post', function() {
      andThen(function() {
        expect(currentPath()).to.equal('post');
      });
    });

    it('creates the post with correct info', function() {
      andThen(function() {
        expect(find('.post-title').text().trim()).to.equal('AAA');
        expect(find('.post-author').text().trim()).to.equal('kanyewest');
        expect(find('.post-content > p').text().trim()).to.equal('things');
      });
    });

  });  // creating a new post

});
