/* jshint expr:true */
import { it } from 'mocha';
import { expect } from 'chai';
import FIXTURE_DATA from './fixture-data';
import describeEmberfireAcceptance from '../helpers/describe-emberfire-acceptance';

describeEmberfireAcceptance(
    'Acceptance: /posts', {fixtureData: FIXTURE_DATA}, function() {

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
