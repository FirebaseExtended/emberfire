import DS from 'ember-data';

/**
 * For testing embedded records
 */
export default DS.Model.extend({
  label: DS.attr('string'),
  created: DS.attr('number'),
  children: DS.hasMany('tree-node', { async: false, inverse: null }),
  config: DS.belongsTo('tree-node-config', { async: false })
});
