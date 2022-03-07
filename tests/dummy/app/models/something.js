
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class SomethingModel extends Model {
  @attr('string') title;
  @attr('string') description;
  @belongsTo('user') user;
  @hasMany('comment') comments;
}
