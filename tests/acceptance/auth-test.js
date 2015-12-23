/* jshint expr:true */
import {
  describe,
  it,
  beforeEach,
  afterEach
} from 'mocha';
import { expect } from 'chai';
import Ember from 'ember';
import sinon from 'sinon';
import Firebase from 'firebase';
import startApp from '../helpers/start-app';
import stubFirebase from '../helpers/stub-firebase';
import unstubFirebase from '../helpers/unstub-firebase';
import createTestRef from '../helpers/create-test-ref';

describe('Acceptance: /auth', function() {
  var application, ref;

  beforeEach(function() {
    stubFirebase();
    application = startApp();
    ref = createTestRef('acceptance');

    var provider = application.__container__.lookup('torii-provider:firebase');
    provider.set('firebase', ref);
  });

  afterEach(function() {
    unstubFirebase();
    Ember.run(application, 'destroy');
  });

  it('can visit /auth', function() {
    visit('/auth');

    andThen(function() {
      expect(currentPath()).to.equal('auth');
    });
  });

  describe('anonymous auth', function () {

    var authMethod, authData;

    beforeEach(function() {
      authData = {
        provider: 'anonymous',
        uid: 'uid1234',
        anonymous: {}
      };
    });

    afterEach(function() {
      authMethod.restore();
    });

    it('creates a session when the auth method returns data', function () {
      authMethod = sinon.stub(Firebase.prototype, 'authAnonymously')
        .yieldsAsync(null, authData);

      visit('/auth');

      andThen(function() {
        expect(find('.user-data-is-authenticated').text().trim()).to.equal('false');
      });

      click('.auth-as-anon');

      andThen(function() {
        expect(find('.user-data-is-authenticated').text().trim()).to.equal('true');
        expect(find('.user-data-provider').text().trim()).to.equal(authData.provider);
        expect(find('.user-data-uid').text().trim()).to.equal(authData.uid);
      });
    });

  }); // anonymous auth

  describe('twitter auth', function () {

    var authMethod, authData;

    beforeEach(function() {
      authData = {
        provider: 'twitter',
        uid: 'twitter:uid1234',
        twitter: {}
      };

      authMethod = sinon.stub(Firebase.prototype, 'authWithOAuthPopup')
        .yieldsAsync(null, authData);
    });

    afterEach(function() {
      authMethod.restore();
    });

    it('creates a session when the auth method returns data', function () {
      visit('/auth');

      andThen(function() {
        expect(find('.user-data-is-authenticated').text().trim()).to.equal('false');
      });

      click('.auth-as-twitter');

      andThen(function() {
        expect(find('.user-data-is-authenticated').text().trim()).to.equal('true');
        expect(find('.user-data-provider').text().trim()).to.equal(authData.provider);
        expect(find('.user-data-uid').text().trim()).to.equal(authData.uid);
      });
    });

  }); // twitter auth

  describe('facebook auth', function () {

    var authMethod, authData;

    beforeEach(function() {
      authData = {
        provider: 'facebook',
        uid: 'facebook:uid1234',
        facebook: {}
      };

      authMethod = sinon.stub(Firebase.prototype, 'authWithOAuthPopup')
        .yieldsAsync(null, authData);
    });

    afterEach(function() {
      authMethod.restore();
    });

    it('creates a session when the auth method returns data', function () {
      visit('/auth');

      andThen(function() {
        expect(find('.user-data-is-authenticated').text().trim()).to.equal('false');
      });

      click('.auth-as-facebook');

      andThen(function() {
        expect(find('.user-data-is-authenticated').text().trim()).to.equal('true');
        expect(find('.user-data-provider').text().trim()).to.equal(authData.provider);
        expect(find('.user-data-uid').text().trim()).to.equal(authData.uid);
      });
    });

  }); // facebook auth

  describe('github auth', function () {

    var authMethod, authData;

    beforeEach(function() {
      authData = {
        provider: 'github',
        uid: 'github:uid1234',
        github: {}
      };

      authMethod = sinon.stub(Firebase.prototype, 'authWithOAuthPopup')
        .yieldsAsync(null, authData);
    });

    afterEach(function() {
      authMethod.restore();
    });

    it('creates a session when the auth method returns data', function () {
      visit('/auth');

      andThen(function() {
        expect(find('.user-data-is-authenticated').text().trim()).to.equal('false');
      });

      click('.auth-as-github');

      andThen(function() {
        expect(find('.user-data-is-authenticated').text().trim()).to.equal('true');
        expect(find('.user-data-provider').text().trim()).to.equal(authData.provider);
        expect(find('.user-data-uid').text().trim()).to.equal(authData.uid);
      });
    });

  }); // google auth

  describe('google auth', function () {

    var authMethod, authData;

    beforeEach(function() {
      authData = {
        provider: 'google',
        uid: 'google:uid1234',
        google: {}
      };

      authMethod = sinon.stub(Firebase.prototype, 'authWithOAuthPopup')
        .yieldsAsync(null, authData);
    });

    afterEach(function() {
      authMethod.restore();
    });

    it('creates a session when the auth method returns data', function () {
      visit('/auth');

      andThen(function() {
        expect(find('.user-data-is-authenticated').text().trim()).to.equal('false');
      });

      click('.auth-as-google');

      andThen(function() {
        expect(find('.user-data-is-authenticated').text().trim()).to.equal('true');
        expect(find('.user-data-provider').text().trim()).to.equal(authData.provider);
        expect(find('.user-data-uid').text().trim()).to.equal(authData.uid);
      });
    });

  }); // google auth

});
