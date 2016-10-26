/* jshint expr:true */
import {
  describe,
  it,
  beforeEach,
  afterEach
} from 'mocha';
import Ember from 'ember';
import { expect } from 'chai';
import sinon from 'sinon';
import describeEmberfireAcceptance from '../helpers/describe-emberfire-acceptance';
import replaceFirebaseAppService from '../helpers/replace-firebase-app-service';

describeEmberfireAcceptance('Acceptance: /auth', function() {
  let signInWithPopupStub;

  const authMock = {
    signInAnonymously() {},
    signInWithPopup() {}
  };

  const firebaseAppMock = {
    auth() {
      return authMock;
    }
  };

  beforeEach(function() {
    signInWithPopupStub = sinon.stub(authMock, 'signInWithPopup');
    replaceFirebaseAppService(this.application, firebaseAppMock);
  });

  afterEach(function() {
    signInWithPopupStub.restore();
  });

  it('can visit /auth', function() {
    visit('/auth');

    andThen(function() {
      expect(currentPath()).to.equal('auth');
    });
  });

  describe('anonymous auth', function () {

    let authData, signInAnonymouslyStub;

    beforeEach(function() {
      authData = {
        uid: 'uid1234',
        isAnonymous: true,
        providerData: []
      };

      signInAnonymouslyStub =
          sinon.stub(authMock, 'signInAnonymously')
              .returns(Ember.RSVP.resolve(authData));
    });

    afterEach(function() {
      signInAnonymouslyStub.restore();
    });

    it('creates a session when the auth method returns data', function () {
      visit('/auth');

      andThen(function() {
        expect(find('.user-data-is-authenticated').text().trim()).to.equal('false');
      });

      click('.auth-as-anon');

      andThen(function() {
        expect(find('.user-data-is-authenticated').text().trim()).to.equal('true');
        expect(find('.user-data-provider').text().trim()).to.equal('anonymous');
        expect(find('.user-data-uid').text().trim()).to.equal('uid1234');
      });
    });

  }); // anonymous auth

  describe('twitter auth', function () {

    let authData;

    beforeEach(function() {
      authData = {
        uid: 'twitter:uid1234',
        providerData: [{providerId: 'twitter.com'}],
      };

      signInWithPopupStub.returns(Ember.RSVP.Promise.resolve(authData));
    });

    it('creates a session when the auth method returns data', function () {
      visit('/auth');

      andThen(function() {
        expect(find('.user-data-is-authenticated').text().trim()).to.equal('false');
      });

      click('.auth-as-twitter');

      andThen(function() {
        expect(find('.user-data-is-authenticated').text().trim()).to.equal('true');
        expect(find('.user-data-provider').text().trim()).to.equal('twitter.com');
        expect(find('.user-data-uid').text().trim()).to.equal(authData.uid);
      });
    });

  }); // twitter auth

  describe('facebook auth', function () {

    let authData;

    beforeEach(function() {
      authData = {
        uid: 'uid1234',
        providerData: [{providerId: 'facebook.com'}],
      };

      signInWithPopupStub.returns(Ember.RSVP.Promise.resolve(authData));
    });

    it('creates a session when the auth method returns data', function () {
      visit('/auth');

      andThen(function() {
        expect(find('.user-data-is-authenticated').text().trim()).to.equal('false');
      });

      click('.auth-as-facebook');

      andThen(function() {
        expect(find('.user-data-is-authenticated').text().trim()).to.equal('true');
        expect(find('.user-data-provider').text().trim()).to.equal('facebook.com');
        expect(find('.user-data-uid').text().trim()).to.equal(authData.uid);
      });
    });

  }); // facebook auth

  describe('github auth', function () {

    let authData;

    beforeEach(function() {
      authData = {
        uid: 'uid1234',
        providerData: [{providerId: 'github.com'}],
      };

      signInWithPopupStub.returns(Ember.RSVP.Promise.resolve(authData));
    });

    it('creates a session when the auth method returns data', function () {
      visit('/auth');

      andThen(function() {
        expect(find('.user-data-is-authenticated').text().trim()).to.equal('false');
      });

      click('.auth-as-github');

      andThen(function() {
        expect(find('.user-data-is-authenticated').text().trim()).to.equal('true');
        expect(find('.user-data-provider').text().trim()).to.equal('github.com');
        expect(find('.user-data-uid').text().trim()).to.equal(authData.uid);
      });
    });

  }); // google auth

  describe('google auth', function () {

    let authData;

    beforeEach(function() {
      authData = {
        uid: 'uid1234',
        providerData: [{providerId: 'google.com'}],
      };

      signInWithPopupStub.returns(Ember.RSVP.Promise.resolve(authData));
    });

    it('creates a session when the auth method returns data', function () {
      visit('/auth');

      andThen(function() {
        expect(find('.user-data-is-authenticated').text().trim()).to.equal('false');
      });

      click('.auth-as-google');

      andThen(function() {
        expect(find('.user-data-is-authenticated').text().trim()).to.equal('true');
        expect(find('.user-data-provider').text().trim()).to.equal('google.com');
        expect(find('.user-data-uid').text().trim()).to.equal(authData.uid);
      });
    });

  }); // google auth

});
