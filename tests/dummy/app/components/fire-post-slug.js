import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['post-slug'],
  publishedMonth: function() {
    return moment(this.get('post.published')).format('MMM');
  }.property('post.published'),
  publishedDay: function() {
    return moment(this.get('post.published')).format('D');
  }.property('post.published')
});
