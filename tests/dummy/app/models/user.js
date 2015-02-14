import DS from 'ember-data';

export default DS.Model.extend({
  created: DS.attr('number'),
  username: function() {
    return this.get('id');
  }.property(),
  avatar: function() {
    return 'https://www.gravatar.com/avatar/' + md5(this.get('id')) + '.jpg?d=retro&size=80';
  }.property(),
  posts: DS.hasMany('post', { async: true })
});
