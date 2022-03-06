import DS from 'ember-data';

const { attr, hasMany, belongsTo } = DS;

export default DS.Model.extend({
  musing: attr('string'),
  user: belongsTo('user'),
  tags: hasMany('tag', { embedded: true }),
});
