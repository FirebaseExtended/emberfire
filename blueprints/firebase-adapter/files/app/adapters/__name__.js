import config from '../config/environment';
import Firebase from 'firebase';
import FirebaseAdapter from 'emberfire/adapters/firebase';

export default <%= baseClass %>.extend({
  firebase: new Firebase(<%= firebaseUrl %>)
});
