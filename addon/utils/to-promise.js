import Ember from 'ember';

export default function(fn, context, _args, errorMsg) {
  var args = _args || [];
  return new Ember.RSVP.Promise(function(resolve, reject) {
    var callback = function(error) {
      if (error) {
        if (errorMsg && typeof error === 'object') {
          error.location = errorMsg;
        }
        reject(error);
      } else {
        resolve();
      }
    };
    args.push(callback);
    fn.apply(context, args);
  });
}
