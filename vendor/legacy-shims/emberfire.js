/*!
 * EmberFire is the officially supported adapter for using Firebase with
 * Ember Data. The DS.FirebaseAdapter provides all of the standard DS.Adapter
 * methods and will automatically synchronize the store with Firebase.
 *
 * EmberFire 0.0.0
 * https://github.com/firebase/emberfire/
 * License: MIT
 */

import Ember from 'ember';
import FirebaseAdapter from '../../addon/adapters/firebase';
import FirebaseSerializer from '../../addon/serializers/firebase';
import EmberFireInitializer from '../../addon/initializers/emberfire';

window.DS.FirebaseAdapter = FirebaseAdapter;
window.DS.FirebaseSerializer = FirebaseSerializer;

Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer(EmberFireInitializer);
});
