/* jshint expr:true */
import { expect } from 'chai';
import {
  describeModule, it
} from 'ember-mocha';
import firebase from 'firebase';
import sinon from 'sinon';
import Ember from 'ember';

const { setOwner } = Ember;

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
      _lookupFactory() {
        return configMock;
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

    it('is the database reference', function() {
      setOwner(this, emberAppMock); // set owner context to mock app
      const service = this.subject(this);
      expect(service).to.be.equal(refMock);
    });

    it('initializes the app with the environment config', function() {
      setOwner(this, emberAppMock); // set owner context to mock app
      this.subject(this);
      expect(initializeAppStub.calledWith(configMock.firebase)).to.be.true;
    });

    it('uses existing app if already present', function() {
      appStub.returns(firebaseAppMock);

      setOwner(this, emberAppMock); // set owner context to mock app
      this.subject(this);
      expect(initializeAppStub.notCalled).to.be.true;
    });
  }
);
