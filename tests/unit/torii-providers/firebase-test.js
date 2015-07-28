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
          authWithOAuthPopup: sinon.stub().yields(errorMock)
        };
        provider.set('firebase', firebaseMock);

        Ember.run(function() {
          provider.open({authWith: 'errorProvider'}).catch(function(error) {
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
          authWithOAuthPopup: sinon.stub().yields(null, authDataMock)
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

    }); // with an OAuth provider


    describe('with email/password provider', function () {

      it('errors when firebase.authWithPassword errors', function(done) {
        let provider = this.subject();
        let errorMock = sinon.spy();
        const firebaseMock = {
          authWithPassword: sinon.stub().yields(errorMock)
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
          authWithPassword: sinon.stub().yields(errorMock)
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
          authWithPassword: sinon.stub().yields(null, authDataMock)
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
          authWithPassword: sinon.stub().yields(null, authDataMock)
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

  });
});
