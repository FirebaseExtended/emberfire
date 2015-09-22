import Ember from 'ember';

export default Ember.Helper.helper(function(params) {
  let content = params[0];
  if (content) {
    return new Ember.String.htmlSafe(window.markdown.toHTML(content));
  }
});
