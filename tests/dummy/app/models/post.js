import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('string'),
  published: DS.attr('number'),
  publishedDate: function() {
    return moment(this.get('published')).format('MMMM Do, YYYY');
  }.property('published'),
  user: DS.belongsTo('user', { async: true }),
  comments: DS.hasMany('comment', { async: true })
});
