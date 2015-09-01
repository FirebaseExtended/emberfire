import Ember from 'ember';

export default function(value, options) {
  var escaped = Ember.Handlebars.Utils.escapeExpression(value);
      escaped = escaped.replace(/(\r\n|\n|\r)/gm, '<br>');
  return new Ember.String.htmlSafe(escaped);
}
