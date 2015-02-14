import Ember from 'ember';

export default function(value, options) {
  if (value) {
    return new Ember.Handlebars.SafeString(window.markdown.toHTML(value));
  }
}
