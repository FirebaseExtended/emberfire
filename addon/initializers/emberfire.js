import Ember from 'ember';
import DS from 'ember-data';
import firebase from 'npm:firebase';

import FirebaseAdapter from '../adapters/firebase';
import FirestoreAdapter from '../adapters/firestore';

import FirebaseSerializer from '../serializers/firebase';
import FirestoreSerializer from '../serializers/firestore';

const VERSION = '0.0.0'

if (Ember.libraries) {
  Ember.libraries.registerCoreLibrary('emberfire', VERSION);
  if (firebase.SDK_VERSION) { 
    Ember.libraries.registerCoreLibrary('firebase', firebase.SDK_VERSION)
  }
}

export function initialize(application) {

  application.register('adapter:-firebase', FirebaseAdapter);
  DS.FirebaseAdapter = FirebaseAdapter;

  application.register('adapter:-firestore', FirestoreAdapter);
  DS.FirestoreAdapter = FirestoreAdapter;

  application.register('serializer:-firebase', FirebaseSerializer);
  DS.FirebaseSerializer = FirebaseSerializer;

  application.register('serializer:-firestore', FirestoreSerializer);
  DS.FirestoreSerializer = FirestoreSerializer;

}

export default {
  name: 'emberfire',
  before: 'ember-data',
  initialize
}