import EmberObject from '@ember/object';

import RSVP from 'rsvp';
const { reject } = RSVP;

export default class FirebaseToriiProvider extends EmberObject.extend({

}) {
    open() {
        return reject(new Error('Please authenticate via the Firebase SDK directly.'));
    }
}