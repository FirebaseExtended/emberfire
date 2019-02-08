import DS from 'ember-data';

const { attr, hasMany } = DS;

export default DS.Model.extend({
    musing: attr('string'),
    tags: hasMany('tag', { embedded: true })
});