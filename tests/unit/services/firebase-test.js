/* jshint expr:true */
import { expect } from 'chai';
import {
  describeModule,
  it
} from 'ember-mocha';
import firebase from 'firebase';

describeModule(
  'emberfire@service:firebase',
  'FirebaseService',
  { },
  function() {
    it('exists', function() {
      const service = this.subject();
      expect(service instanceof firebase.database.Reference);
    });
  }
);
