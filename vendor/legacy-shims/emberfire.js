import Ember from 'ember';
import FirebaseAdapter from '../../addon/adapters/firebase';
import FirebaseSerializer from '../../addon/serializers/firebase';
import EmberFireInitializer from '../../addon/initializers/emberfire';

window.DS.FirebaseAdapter = FirebaseAdapter;
window.DS.FirebaseSerializer = FirebaseSerializer;

Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer(EmberFireInitializer);
});
