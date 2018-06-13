import DS from 'ember-data';

const { attr, hasMany } = DS;

export default DS.Model.extend({
    name: attr('string'),
    somethings: hasMany('something'/*, { query: ref => ref.orderBy('title')}*/),
    thoughts: hasMany('thought', { embedded: true })
});