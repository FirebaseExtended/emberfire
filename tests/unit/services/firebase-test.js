/* jshint expr:true */
import { expect } from 'chai';
import {
  describeModule
} from 'ember-mocha';
import firebase from 'firebase';
import sinon from 'sinon';

describeModule(
  'emberfire@service:firebase',
  'FirebaseService',
  { },
  function() {
    xit('is a firebase reference', function() {
      const appMock = sinon.spy();
      const refMock = sinon.spy();
      const databaseMock = { ref() { return refMock; } };

      const initializeAppStub =
          sinon.stub(firebase, 'initializeApp')
              .returns(appMock);
      const databaseStub =
          sinon.stub(firebase, 'database')
              .returns(databaseMock);


      const service = this.subject();
      expect(service).to.be.equal(refMock);
      initializeAppStub.restore();
      databaseStub.restore();
    });
  }
);
