/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'dummy',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    firebase: 'https://emberfire-demo.firebaseio.com',
    torii: {
      sessionServiceName: 'session'
    },
    contentSecurityPolicy: {
      'style-src': '\'self\' \'unsafe-inline\' fonts.googleapis.com',
      'font-src': '\'self\' fonts.gstatic.com',
      'img-src': '\'self\' *.gravatar.com s3.amazonaws.com',
      'connect-src': '\'self\' wss://*.firebaseio.com https://auth.firebase.com'
    },
    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    firebase: {
      apiKey: "AIzaSyDOlKivprJ3SquwbMUoBB0uK7V_FjUWAqI",
      authDomain: "topstory.firebaseapp.com",
      databaseURL: "https://topstory.firebaseio.com"
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
