import Ember from 'ember';

var Promise = Ember.RSVP.Promise;

export default Ember.Component.extend({
  classNames: ['post'],
  classNameBindings: ['isExpanded:post-expanded', 'isSingle:post-single'],
  commentUsername: '',
  commentBody: '',
  commentIsValid: function() {
    var isValid = true;
    ['commentUsername', 'commentBody'].forEach(function(field) {
      if (this.get(field) === '') {
        isValid = false;
      }
    }, this);
    return isValid;
  },
  actions: {
    publishComment: function() {
      if (!this.commentIsValid()) { return; }
      var store = this.get('store');
      Ember.RSVP.hash({
        user: this.get('util').getUserByUsername(this.get('commentUsername'))
      }).then(function(promises) {
        // Create a new comment
        var comment = store.createRecord('comment', {
          body: this.get('commentBody'),
          published: new Date().getTime(),
          user: promises.user
        });
        // Tell the post about the comment
        this.sendAction('onPublishComment', this.get('post'), comment);
        // Reset the fields
        this.setProperties({
          commentUsername: '',
          commentBody: ''
        });
      }.bind(this));
    },
    removeComment: function(comment) {
      var post = this.get('post');
      Promise.cast(post.get('comments')).then(function(comments) {
        comments.removeObject(comment);
        comment.destroyRecord();
        post.save();
      });
    }
  },
});
