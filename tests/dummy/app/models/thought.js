import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ThoughtModel extends Model {
  @attr('string') musing;
  @belongsTo('user') user;
  @hasMany('tag', { embedded: true }) tags;
}
