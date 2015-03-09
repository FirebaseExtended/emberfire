module.exports = {
  description: 'Generates a firebase adapter.',

  locals: function(options) {
    var firebaseUrl     = 'config.firebase';
    var baseClass       = 'FirebaseAdapter';

    return {
      baseClass: baseClass,
      firebaseUrl: firebaseUrl
    };
  }
};
