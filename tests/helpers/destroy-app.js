import Ember from 'ember';
import destroyFirebaseApps from './destroy-firebase-apps';

export default function destroyApp(application) {
  destroyFirebaseApps();
  Ember.run(application, 'destroy');
}
