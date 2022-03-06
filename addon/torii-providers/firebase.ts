import EmberObject from '@ember/object';
import { reject } from 'rsvp';

export default class FirebaseToriiProvider extends EmberObject {
  open() {
    return reject(
      new Error('Please authenticate via the Firebase SDK directly.')
    );
  }
}
