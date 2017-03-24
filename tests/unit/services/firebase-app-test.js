/* jshint expr:true */
import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';
import firebase from 'firebase';
import sinon from 'sinon';
import Ember from 'ember';

const { setOwner } = Ember;

describe('FirebaseAppService', function() {
  setupTest('emberfire@service:firebase-app');

  const configMock = {
    firebase: {
      blah: 'a'
    }
  };

  const emberAppMock = {
    resolveRegistration() {
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

  it('is the firebase app', function() {
    setOwner(this, emberAppMock); // set owner context to mock app
    const service = this.subject(this);
    expect(service).to.be.equal(firebaseAppMock);
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
});
