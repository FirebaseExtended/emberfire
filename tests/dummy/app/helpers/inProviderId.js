import Ember from 'ember';

export default Ember.Helper.helper(function (params) {
  if (Ember.isArray(params[0])) {
    for (var i = 0, len = params[0].length; i < len; i++) {
      if (params[0][i].providerId === params[1]) {
        return true;
      }
    }
  }
  return false;
});


