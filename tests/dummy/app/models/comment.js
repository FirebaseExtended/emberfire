import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  body: DS.attr('string'),
  published: DS.attr('number'),
  publishedDate: Ember.computed('published', function() {
    var m = moment(this.get('published'));
    return `${m.format('MMMM Do, YYYY')} at ${m.format('h:mm:ss a')}`;
  }),
  user: DS.belongsTo('user', { async: true })
});
