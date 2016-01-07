import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';
import sinon from 'sinon';

describeModule('torii-provider:firebase', 'FirebaseToriiProvider', {
  needs: ['service:firebase'],
}, function() {

  describe('#open', function() {

    describe('with an OAuth provider', function () {

      it('errors when firebase.authWithOAuthPopup errors', function(done) {
        let provider = this.subject();
        let errorMock = sinon.spy();
        const firebaseMock = {
          authWithOAuthPopup: sinon.stub().yieldsAsync(errorMock)
        };
        provider.set('firebase', firebaseMock);

        Ember.run(function() {
          provider.open({provider: 'errorProvider'}).catch(function(error) {
            expect(firebaseMock.authWithOAuthPopup.calledWith('errorProvider')).to.be.true;

            expect(error).to.equal(errorMock);
            done();
          });
        });
      });

      it('returns authData when firebase.authWithOAuthPopup returns authData', function(done) {
        let provider = this.subject();
        let authDataMock = sinon.spy();
        const firebaseMock = {
          authWithOAuthPopup: sinon.stub().yieldsAsync(null, authDataMock)
        };
        provider.set('firebase', firebaseMock);

        Ember.run(function() {
          provider.open({provider: 'successProvider'}).then(function(authData) {
            expect(firebaseMock.authWithOAuthPopup.calledWith('successProvider')).to.be.true;

            expect(authData).to.equal(authDataMock);
            done();
          });
        });
      });

      it('passes through provider settings', function(done) {
        let provider = this.subject();
        let authDataMock = sinon.spy();
        let settingsMock = sinon.spy();
        const firebaseMock = {
          authWithOAuthPopup: sinon.stub().yieldsAsync(null, authDataMock)
        };
        provider.set('firebase', firebaseMock);

        Ember.run(function() {
          provider.open({provider: 'successProvider', settings: settingsMock }).then(function(authData) {
            expect(firebaseMock.authWithOAuthPopup.calledWith('successProvider', sinon.match.func, settingsMock)).to.be.true;

            expect(authData).to.equal(authDataMock);
            done();
          });
        });
      });

      it('calls firebase.authWithOAuthRedirect if options.redirect is true', function(done) {
        let provider = this.subject();
        let authDataMock = sinon.spy();
        const firebaseMock = {
          authWithOAuthRedirect: sinon.stub().yieldsAsync(null, authDataMock)
        };
        provider.set('firebase', firebaseMock);

        Ember.run(function() {
          provider.open({provider: 'successProvider', redirect: true }).then(function(authData) {
            expect(firebaseMock.authWithOAuthRedirect.calledWith('successProvider')).to.be.true;

            expect(authData).to.equal(authDataMock);
            done();
          });
        });
      });

    }); // with an OAuth provider


    describe('with email/password provider', function () {

      it('errors when firebase.authWithPassword errors', function(done) {
        let provider = this.subject();
        let errorMock = sinon.spy();
        const firebaseMock = {
          authWithPassword: sinon.stub().yieldsAsync(errorMock)
        };
        provider.set('firebase', firebaseMock);

        Ember.run(function() {
          provider.open({
            provider: 'password',
            email: 'email',
            password: 'password'
          }).catch(function(error) {
            expect(firebaseMock.authWithPassword.calledOnce).to.be.true;

            expect(error).to.equal(errorMock);
            done();
          });
        });
      });

      it('errors when `email` and `password` are not supplied', function(done) {
        let provider = this.subject();
        let errorMock = sinon.spy();
        const firebaseMock = {
          authWithPassword: sinon.stub().yieldsAsync(errorMock)
        };
        provider.set('firebase', firebaseMock);

        Ember.run(function() {
          provider.open({
            provider: 'password'
          }).catch(function(error) {

            expect(error.message).to.equal('`email` and `password` must be supplied');
            done();
          });
        });
      });

      it('returns authData when firebase.authWithPassword returns authData', function(done) {
        let provider = this.subject();
        let authDataMock = sinon.spy();
        const firebaseMock = {
          authWithPassword: sinon.stub().yieldsAsync(null, authDataMock)
        };
        provider.set('firebase', firebaseMock);

        Ember.run(function() {
          provider.open({
            provider: 'password',
            email: 'email',
            password: 'password'
          }).then(function(authData) {
            expect(firebaseMock.authWithPassword.calledOnce).to.be.true;

            expect(authData).to.equal(authDataMock);
            done();
          });
        });
      });

      it('passes email and password parameters through to authWithPassword', function(done) {
        let provider = this.subject();
        let authDataMock = sinon.spy();
        const firebaseMock = {
          authWithPassword: sinon.stub().yieldsAsync(null, authDataMock)
        };
        provider.set('firebase', firebaseMock);

        Ember.run(function() {
          provider.open({
            provider: 'password',
            email: 'email',
            password: 'password'
          }).then(function(authData) {
            expect(firebaseMock.authWithPassword.calledWith({
              email: 'email',
              password: 'password'
            })).to.be.true;

            expect(authData).to.equal(authDataMock);
            done();
          });
        });
      });

    }); // with email/password provider


    describe('with an anonymous provider', function() {
      it('errors when firebase.authAnonymously errors', function(done) {
        let provider = this.subject();
        let errorMock = sinon.spy();
        const firebaseMock = {
          authAnonymously: sinon.stub().yieldsAsync(errorMock)
        };
        provider.set('firebase', firebaseMock);

        Ember.run(function() {
          provider.open({
            provider: 'anonymous'
          }).catch(function(error) {
            expect(firebaseMock.authAnonymously.calledOnce).to.be.true;
            expect(error).to.equal(errorMock);
            done();
          });
        });
      });

      it('returns authData when firebase.authAnonymously returns authData', function(done) {
        let provider = this.subject();
        let authDataMock = sinon.spy();
        const firebaseMock = {
          authAnonymously: sinon.stub().yieldsAsync(null, authDataMock)
        };
        provider.set('firebase', firebaseMock);

        Ember.run(function() {
          provider.open({
            provider: 'anonymous'
          }).then(function(authData) {
            expect(firebaseMock.authAnonymously.calledOnce).to.be.true;
            expect(authData).to.equal(authDataMock);
            done();
          });
        });
      });
    }); // with anonymous auth

    describe('with custom authentication', function() {
      it('errors when firebase.authWithCustomToken errors', function(done) {
        let provider = this.subject();
        let errorMock = sinon.spy();
        const firebaseMock = {
          authWithCustomToken: sinon.stub().yieldsAsync(errorMock)
        };
        provider.set('firebase', firebaseMock);

        Ember.run(function() {
          provider.open({
            provider: 'custom',
            token: 'token'
          }).catch(function(error) {
            expect(firebaseMock.authWithCustomToken.calledOnce).to.be.true;
            expect(error).to.equal(errorMock);
            done();
          });
        });
      });

      it('errors when a token is not supplied', function(done) {
        let provider = this.subject();
        let errorMock = sinon.spy();
        const firebaseMock = {
          authWithCustomToken: sinon.stub().yieldsAsync(errorMock)
        };
        provider.set('firebase', firebaseMock);

        Ember.run(function() {
          provider.open({
            provider: 'custom'
          }).catch(function(error) {

            expect(error.message).to.equal('A token must be supplied');
            done();
          });
        });
      });

      it('returns authData when firebase.authWithCustomToken returns authData', function(done) {
        let provider = this.subject();
        let authDataMock = sinon.spy();
        const firebaseMock = {
          authWithCustomToken: sinon.stub().yieldsAsync(null, authDataMock)
        };
        provider.set('firebase', firebaseMock);

        Ember.run(function() {
          provider.open({
            provider: 'custom',
            token: 'token'
          }).then(function(authData) {
            expect(firebaseMock.authWithCustomToken.calledOnce).to.be.true;
            expect(authData).to.equal(authDataMock);
            done();
          });
        });
      });

      it('passes a token parameter through to firebase.authWithCustomToken', function(done) {
        let provider = this.subject();
        let authDataMock = sinon.spy();
        const firebaseMock = {
          authWithCustomToken: sinon.stub().yieldsAsync(null, authDataMock)
        };
        provider.set('firebase', firebaseMock);

        Ember.run(function() {
          provider.open({
            provider: 'custom',
            token: 'token'
          }).then(function(authData) {
            expect(firebaseMock.authWithCustomToken.calledWith('token')).to.be.true;
            expect(authData).to.equal(authDataMock);
            done();
          });
        });
      });
    }); // with custom authentication
  });
});
