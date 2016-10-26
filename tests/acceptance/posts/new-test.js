/* jshint expr:true */
import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import FIXTURE_DATA from '../fixture-data';
import describeEmberfireAcceptance from '../../helpers/describe-emberfire-acceptance';

describeEmberfireAcceptance(
    'Acceptance: /posts/new', {fixtureData: FIXTURE_DATA}, function() {

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
