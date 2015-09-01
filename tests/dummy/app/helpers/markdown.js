import Ember from 'ember';

export default function(value, options) {
  if (value) {
    return new Ember.String.htmlSafe(window.markdown.toHTML(value));
  }
}
