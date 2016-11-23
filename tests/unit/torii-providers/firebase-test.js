import Ember from 'ember';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';
import sinon from 'sinon';

const { run } = Ember;

describe('FirebaseToriiProvider', function() {
  setupTest('emberfire@torii-provider:firebase');

  const firebaseAppMock = {
    auth() { return authMock; }
  };

  const authMock = {
    signInAnonymously() {},
    signInWithCustomToken() {},
    signInWithEmailAndPassword() {},
    signInWithPopup() {},
    signInWithRedirect() {},
  };

  class ProviderMock {
    addScope(scope) {}
  }

  beforeEach(function() {
    this.registry.register('service:firebaseApp', firebaseAppMock,
        {instantiate: false, singleton: true});
    this.registry.register('firebase-auth-provider:google', ProviderMock,
        {instantiate: false, singleton: false});
  });

  describe('#open', function() {

    describe('with an OAuth provider', function () {

      it('errors when supplying an invalid provider', function(done) {
        let provider = this.subject();
        run(function() {
          provider.open({provider: 'errorProvider'}).catch(function(error) {
            expect(error.message).to.equal('Unknown provider');
            done();
          });
        });
      });

      it('passes through errors', function(done) {
        let errorMock = sinon.spy();
        const stub =
            sinon.stub(authMock, 'signInWithPopup')
                .returns(Ember.RSVP.reject(errorMock));

        let provider = this.subject();
        run(function() {
          provider.open({provider: 'google'}).catch(function(error) {
            expect(error).to.equal(errorMock);
            stub.restore();
            done();
          });
        });
      });

      it('instantiates the correct auth provider', function(done) {
        class OtherProvider {}

        let userMock = sinon.spy();
        const stub =
            sinon.stub(authMock, 'signInWithPopup')
                .returns(Ember.RSVP.resolve(userMock));

        this.registry.register(
            'firebase-auth-provider:other', OtherProvider,
                {instantiate: false, singleton: false});

        let provider = this.subject();
        run(function() {
          provider.open({provider: 'other'}).then(function(error) {
            expect(stub.args[0][0]).to.be.an.instanceof(OtherProvider);
            stub.restore();
            done();
          });
        });
      });

      it('returns user when auth returns user', function(done) {
        const userMock = sinon.spy();
        const stub =
            sinon.stub(authMock, 'signInWithPopup')
                .returns(Ember.RSVP.resolve(userMock));

        let provider = this.subject();
        run(function() {
          provider.open({provider: 'google'}).then(function(result) {
            expect(result).to.deep.equal(userMock);
            stub.restore();
            done();
          });
        });
      });

      it('extracts user when auth returns nested user', function(done) {
        const user = {uid: 'bob', providerData: [{providerId: 'google.com'}]};
        const stub =
            sinon.stub(authMock, 'signInWithPopup')
                .returns(Ember.RSVP.resolve({user: user}));

        let provider = this.subject();
        run(function() {
          provider.open({provider: 'google'}).then(function(result) {
            expect(result).to.deep.equal(user);
            stub.restore();
            done();
          });
        });
      });

      it('handles CSV formatted scopes', function(done) {
        const userMock = sinon.spy();
        const stub =
            sinon.stub(authMock, 'signInWithPopup')
                .returns(Ember.RSVP.resolve(userMock));

        const addScopeStub =
            sinon.stub(ProviderMock.prototype, 'addScope');

        let provider = this.subject();

        const settings = {
          scope: 'user,public_profile'
        };

        run(function() {
          provider.open({provider: 'google', settings}).then(function(result) {
            expect(addScopeStub.calledWith('user')).to.be.true;
            expect(addScopeStub.calledWith('public_profile')).to.be.true;
            addScopeStub.restore();
            stub.restore();
            done();
          });
        });
      });

      it('calls signInWithRedirect if options.redirect is true', function(done) {
        const userMock = sinon.spy();
        const stub =
            sinon.stub(authMock, 'signInWithRedirect')
                .returns(Ember.RSVP.resolve(userMock));

        let provider = this.subject();
        run(function() {
          provider.open({provider: 'google', redirect: true }).then(function(result) {
            expect(stub.called).to.be.true;
            expect(result).to.equal(userMock);
            stub.restore();
            done();
          });
        });
      });

    }); // with an OAuth provider


    describe('with email/password provider', function () {

      it('passes through email and password params', function(done) {
        let userMock = sinon.spy();
        const stub =
            sinon.stub(authMock, 'signInWithEmailAndPassword')
                .returns(Ember.RSVP.resolve(userMock));

        let provider = this.subject();
        run(function() {
          provider.open({
            provider: 'password',
            email: 'email',
            password: 'password'
          }).then(function(error) {
            expect(stub.calledWith('email', 'password')).to.equal(true);
            stub.restore();
            done();
          });
        });
      });

      it('passes through errors', function(done) {
        let errorMock = sinon.spy();
        const stub =
            sinon.stub(authMock, 'signInWithEmailAndPassword')
                .returns(Ember.RSVP.reject(errorMock));

        let provider = this.subject();
        run(function() {
          provider.open({
            provider: 'password',
            email: 'email',
            password: 'password'
          }).catch(function(error) {
            expect(error).to.be.equal(errorMock);
            stub.restore();
            done();
          });
        });
      });

      it('errors when `email` is not supplied', function(done) {
        let provider = this.subject();
        run(function() {
          provider.open({
            provider: 'password',
            password: 'password'
          }).catch(function(error) {

            expect(error.message).to.equal('`email` and `password` must be supplied');
            done();
          });
        });
      });

      it('errors when `password` is not supplied', function(done) {
        let provider = this.subject();
        run(function() {
          provider.open({
            provider: 'password',
            email: 'email'
          }).catch(function(error) {

            expect(error.message).to.equal('`email` and `password` must be supplied');
            done();
          });
        });
      });

      it('returns user data when successful', function(done) {
        let userMock = sinon.spy();
        const stub =
            sinon.stub(authMock, 'signInWithEmailAndPassword')
                .returns(Ember.RSVP.resolve(userMock));

        let provider = this.subject();
        run(function() {
          provider.open({
            provider: 'password',
            email: 'email',
            password: 'password'
          }).then(function(result) {
            expect(result).to.equal(userMock);
            stub.restore();
            done();
          });
        });
      });

    }); // with email/password provider


    describe('with an anonymous provider', function() {
      it('passes through errors', function(done) {
        let errorMock = sinon.spy();
        const stub =
            sinon.stub(authMock, 'signInAnonymously')
                .returns(Ember.RSVP.reject(errorMock));

        let provider = this.subject();
        run(function() {
          provider.open({
            provider: 'anonymous'
          }).catch(function(error) {
            expect(stub.calledOnce).to.be.true;
            expect(error).to.equal(errorMock);
            stub.restore();
            done();
          });
        });
      });

      it('returns user data when successful', function(done) {
        let userMock = sinon.spy();
        const stub =
            sinon.stub(authMock, 'signInAnonymously')
                .returns(Ember.RSVP.resolve(userMock));

        let provider = this.subject();
        run(function() {
          provider.open({
            provider: 'anonymous'
          }).then(function(result) {
            expect(stub.calledOnce).to.be.true;
            expect(result).to.equal(userMock);
            stub.restore();
            done();
          });
        });
      });
    }); // with anonymous auth

    describe('with custom authentication', function() {

      it('passes through errors', function(done) {
        let errorMock = sinon.spy();
        const stub =
            sinon.stub(authMock, 'signInWithCustomToken')
                .returns(Ember.RSVP.reject(errorMock));

        let provider = this.subject();
        run(function() {
          provider.open({
            provider: 'custom',
            token: 'token'
          }).catch(function(error) {
            expect(stub.calledOnce).to.be.true;
            expect(error).to.equal(errorMock);
            stub.restore();
            done();
          });
        });
      });

      it('returns user data when successful', function(done) {
        let userMock = sinon.spy();
        const stub =
            sinon.stub(authMock, 'signInWithCustomToken')
                .returns(Ember.RSVP.resolve(userMock));

        let provider = this.subject();
        run(function() {
          provider.open({
            provider: 'custom',
            token: 'token'
          }).then(function(result) {
            expect(stub.calledOnce).to.be.true;
            expect(result).to.equal(userMock);
            stub.restore();
            done();
          });
        });
      });

      it('errors when a token is not supplied', function(done) {
        let provider = this.subject();
        run(function() {
          provider.open({
            provider: 'custom'
          }).catch(function(error) {
            expect(error.message).to.equal('A token must be supplied');
            done();
          });
        });
      });

      it('passes the token parameter through', function(done) {
        let userMock = sinon.spy();
        const stub =
            sinon.stub(authMock, 'signInWithCustomToken')
                .returns(Ember.RSVP.resolve(userMock));

        let provider = this.subject();
        run(function() {
          provider.open({
            provider: 'custom',
            token: 'token'
          }).then(function(authData) {
            expect(stub.calledWith('token')).to.be.true;
            stub.restore();
            done();
          });
        });
      });
    }); // with custom authentication
  });
});
