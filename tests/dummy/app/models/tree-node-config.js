import DS from 'ember-data';

/**
 * For testing embedded records
 */
export default DS.Model.extend({
  sync: DS.attr('boolean')
});
