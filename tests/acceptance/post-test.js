/* jshint expr:true */
import { it } from 'mocha';
import { expect } from 'chai';
import Ember from 'ember';

import describeEmberfireAcceptance from '../helpers/describe-emberfire-acceptance';

describeEmberfireAcceptance('Acceptance: /post/:id', function(ref) {
  it('can visit /post/post_1', function() {
    visit('/post/post_1');

    andThen(function() {
      expect(currentPath()).to.equal('post');
    });
  });

  it('shows the post author', function() {
    visit('/post/post_1');

    andThen(function() {
      expect(find('.post-author').text().trim()).to.equal('tstirrat');
    });
  });

  it('shows the post date', function() {
    visit('/post/post_1');

    andThen(function() {
      expect(find('.post-date').text().trim()).to.not.equal(''); // careful of timezones here
    });
  });

  it('shows the post title', function() {
    visit('/post/post_1');

    andThen(function() {
      expect(find('.post-title').text().trim()).to.equal('Post 1');
    });
  });

  it('shows the post body', function() {
    visit('/post/post_1');

    andThen(function() {
      expect(find('.post-content').text().trim()).to.equal('Post 1 body');
    });
  });

  it('shows all comments', function() {
    visit('/post/post_1');

    andThen(function() {
      expect(find('.post-comment:not(.post-comment-new)').length).to.equal(2);
    });
  });

  it('shows comment author', function() {
    visit('/post/post_1');

    andThen(function() {
      expect(find('.post-comment:first .post-comment-author').text().trim()).to.equal('sara');
    });
  });

  it('shows formatted comment date', function() {
    visit('/post/post_1');

    andThen(function() {
      expect(find('.post-comment:first .post-comment-date').text().trim()).to.not.equal(''); // careful of timezones
    });
  });

  it('updates properties if they change on the server', function() {
    visit('/post/post_1');

    andThen(function() {
      expect(find('.post-title').text().trim()).to.equal('Post 1');
    });

    andThen(() => {
      Ember.run(() => {
        this.ref.child('posts/post_1/title').set('Post 1 UPDATED');
      });
    });

    andThen(function() {
      expect(find('.post-title').text().trim()).to.equal('Post 1 UPDATED');
    });
  });

  describe('the new comment entry form', function () {

    it('contains a username entry field', function() {
      visit('/post/post_1');

      andThen(function() {
        expect(find('.post-comment-new input').length).to.equal(1);
      });
    });

    it('contains a comment body entry field', function() {
      visit('/post/post_1');

      andThen(function() {
        expect(find('.post-comment-new textarea').length).to.equal(1);
      });
    });

  }); // the new comment entry form
});
