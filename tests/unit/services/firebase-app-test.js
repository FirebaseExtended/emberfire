/* jshint expr:true */
import { expect } from 'chai';
import {
  describeModule, it
} from 'ember-mocha';
import firebase from 'firebase';
import sinon from 'sinon';

describeModule(
  'emberfire@service:firebase-app',
  'FirebaseAppService',
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
    let appStub;

    beforeEach(() => {
      appStub =
          sinon.stub(firebase, 'app')
              .throws('no app');

      initializeAppStub =
          sinon.stub(firebase, 'initializeApp')
              .returns(firebaseAppMock);
    });

    afterEach(() => {
      appStub.restore();
      initializeAppStub.restore();
    });

    it('is the firebase app', function() {
      const service = this.subject(emberAppMock);
      expect(service).to.be.equal(firebaseAppMock);
    });

    it('initializes the app with the environment config', function() {
      this.subject(emberAppMock);
      expect(initializeAppStub.calledWith(configMock.firebase)).to.be.true;
    });

    it('uses existing app if already present', function() {
      appStub.returns(firebaseAppMock);

      this.subject(emberAppMock);
      expect(initializeAppStub.notCalled).to.be.true;
    });
  }
);
