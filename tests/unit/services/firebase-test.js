/* jshint expr:true */
import { expect } from 'chai';
import {
  describeModule, it
} from 'ember-mocha';
import firebase from 'firebase';
import sinon from 'sinon';

describeModule(
  'emberfire@service:firebase',
  'FirebaseService',
  { },
  function() {

    const configMock = {
      firebase: {
        blah: 'a'
      }
    };

    const emberAppMock = {
      container: {
        lookupFactory() {
          return configMock;
        }
      }
    };

    const firebaseAppMock = {
      name: '[EmberFire default app]',
      database() {
        return databaseMock;
      }
    };

    const databaseMock = {
      ref() { return refMock; }
    };

    const refMock = {};

    let initializeAppStub;

    beforeEach(() => {
      initializeAppStub =
          sinon.stub(firebase, 'initializeApp')
              .returns(firebaseAppMock);
    });

    afterEach(() => {
      initializeAppStub.restore();
    });

    it('is the database reference', function() {
      const service = this.subject(emberAppMock);
      expect(service).to.be.equal(refMock);
    });

    it('initializes the app with the environment config', function() {
      this.subject(emberAppMock);
      expect(initializeAppStub.calledWith(configMock.firebase)).to.be.true;
    });
  }
);
