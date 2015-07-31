import Ember from 'ember';
import ToriiFirebaseAdapter from 'emberfire/torii-adapters/firebase';
export default ToriiFirebaseAdapter.extend({
  firebase: Ember.inject.service()
});