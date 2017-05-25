import Ember from 'ember';
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  findAll: function() {
    return Ember.RSVP.resolve({
      data: [{
        id: '1',
        type: 'widget',
        attributes: {
          name: "WIDGET 1",
        },
      }],
    });
  },
});
