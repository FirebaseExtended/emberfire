import Ember from 'ember';
import DS from 'ember-data';
import firebase from 'firebase';
import * as auth from '@firebase/auth';
import * as database from '@firebase/database';
import * as firestore from '@firebase/firestore';
import * as functions from '@firebase/functions';
import * as storage from '@firebase/storage';

import FirebaseAdapter from '../adapters/firebase';
import FirestoreAdapter from '../adapters/firestore';

import FirebaseSerializer from '../serializers/firebase';
import FirestoreSerializer from '../serializers/firestore';
import * as Package from '../../package.json';

if (Ember.libraries) {
  Ember.libraries.registerCoreLibrary('emberfire', Package.version);
  if (firebase.SDK_VERSION)  { Ember.libraries.registerCoreLibrary('firebase',            firebase.SDK_VERSION)  }
  if (auth.SDK_VERSION)      { Ember.libraries.registerCoreLibrary('@firebase/auth',      auth.SDK_VERSION)      }
  if (database.SDK_VERSION)  { Ember.libraries.registerCoreLibrary('@firebase/database',  database.SDK_VERSION)  }
  if (firestore.SDK_VERSION) { Ember.libraries.registerCoreLibrary('@firebase/firestore', firestore.SDK_VERSION) }
  if (functions.SDK_VERSION) { Ember.libraries.registerCoreLibrary('@firebase/functions', functions.SDK_VERSION) }
  if (storage.SDK_VERSION)   { Ember.libraries.registerCoreLibrary('@firebase/storage',   storage.SDK_VERSION)   }
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