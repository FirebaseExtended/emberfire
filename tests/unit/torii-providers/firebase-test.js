import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';
import sinon from 'sinon';

describeModule('torii-provider:firebase', 'FirebaseToriiProvider', {
  needs: ['service:firebase'],
}, function() {

  describe('#open', function() {
    it('errors when firebase.authWithOAuthPopup errors', function() {
      let provider = this.subject();
      let errorMock = sinon.spy();
      const firebaseMock = {
        authWithOAuthPopup: sinon.stub().yields(errorMock)
      };
      provider.set('firebase', firebaseMock);

      Ember.run(function() {
        provider.open({authWith: 'errorProvider'}).catch(function(error) {
          assert.ok(firebaseMock.authWithOAuthPopup.calledWith('errorProvider'));

          assert.equal(error, errorMock);
        });
      });
    });

    it('returns authData when firebase.authWithOAuthPopup returns authData', function() {
      let provider = this.subject();
      let authDataMock = sinon.spy();
      const firebaseMock = {
        authWithOAuthPopup: sinon.stub().yields(null, authDataMock)
      };
      provider.set('firebase', firebaseMock);

      Ember.run(function() {
        provider.open({authWith: 'successProvider'}).then(function(authData) {
          assert.ok(firebaseMock.authWithOAuthPopup.calledWith('successProvider'));

          assert.equal(authData, authDataMock);
        });
      });
    });
  });
});
