import Ember from 'ember';

export default Ember.Helper.helper(function(params) {
  let value = params[0];
  if (value) {
    let escaped = Ember.Handlebars.Utils.escapeExpression(value);
        escaped = escaped.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new Ember.String.htmlSafe(escaped);
  }
});
