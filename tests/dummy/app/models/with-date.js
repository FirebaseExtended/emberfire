import DS from 'ember-data';

export default DS.Model.extend({
  published: DS.attr('date'),
});
