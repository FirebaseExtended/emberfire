import Model, { attr, hasMany } from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') name;
  @hasMany('something', { query: (ref) => ref.orderBy('title') }) somethings;
  @hasMany('thought', { subcollection: true }) thoughts;
  @hasMany('comments') comments;
}
