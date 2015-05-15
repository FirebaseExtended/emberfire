import Ember from 'ember';
import FirebaseAdapter from 'emberfire/adapters/firebase';

const {inject, computed} = Ember;

export default FirebaseAdapter.extend({
  firebase: inject.service(),
});
