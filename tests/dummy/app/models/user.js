import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  created: DS.attr('number'),
  username: Ember.computed(function() {
    return this.get('id');
  }),
  firstName: DS.attr('string'),
  avatar: Ember.computed(function() {
    return 'https://www.gravatar.com/avatar/' + md5(this.get('id')) + '.jpg?d=retro&size=80';
  })
});
