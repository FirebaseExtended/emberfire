import Ember from 'ember';
import Application from '../../app';
/* jshint unused:false */
import Router from '../../router';
import config from '../../config/environment';
import Firebase from 'firebase';

export default function startApp(attrs) {
  var application;

  var attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Ember.run(function() {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();

    Firebase.goOffline();
  });

  return application;
}
