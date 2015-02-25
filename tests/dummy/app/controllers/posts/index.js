import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortProperties: ['published'],
  sortAscending: false
});
