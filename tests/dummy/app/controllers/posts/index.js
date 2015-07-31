import Ember from 'ember';

export default Ember.Controller.extend({
  posts: Ember.computed.sort('model', function (a, b) {
    return b.get('published') - a.get('published');
  })
});
