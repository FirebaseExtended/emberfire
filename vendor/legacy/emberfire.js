import Ember from 'ember';
import DS from 'ember-data';
import FirebaseAdapter from '../../addon/adapters/firebase';
import FirebaseSerializer from '../../addon/serializers/firebase';
import EmberFireInitializer from '../../addon/initializers/emberfire';

DS.FirebaseAdapter = FirebaseAdapter;
DS.FirebaseSerializer = FirebaseSerializer;

Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer(EmberFireInitializer);
});
