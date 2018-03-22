import DS from 'ember-data';
import Ember from 'ember';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
    title: attr('string'),
    description: attr('string'),
    user: belongsTo('user')
});