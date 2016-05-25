import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';
import sinon from 'sinon';

describeModule('emberfire@torii-adapter:firebase', 'FirebaseToriiAdapter', {
  needs: ['service:firebase'],
}, function() {

  describe('#open', function() {
    it('returns Promise that resolves to currentUser', function() {
      const adapter = this.subject();
      const currentUser = { handle: 'bob' };

      Ember.run(function() {
        const result = adapter.open({provider: 'twitter', twitter: currentUser});
        assert.ok(result instanceof Ember.RSVP.Promise, 'return is a promise');
        result.then(function(session){
          assert.equal(session.provider, 'twitter', 'provider is passed to resolved value');
          assert.deepEqual(session.currentUser, currentUser);
        });
      });
    });
  });

  describe('#fetch', function(){
    it('returns session information when user logged in', function(){
      const adapter = this.subject();
      const currentUser = {handle: 'bob'};
      const firebaseMock = {
        getAuth: sinon.stub().returns({provider: 'twitter', twitter: currentUser})
      };
      adapter.set('firebase', firebaseMock);

      Ember.run(function(){
        const result = adapter.fetch();
        assert.ok(result instanceof Ember.RSVP.Promise, 'return is a promise');
        result.then(function(session){
          assert.equal(session.provider, 'twitter', 'provider is passed to resolved value');
          assert.deepEqual(session.currentUser, currentUser);
        });
      });
    });

    it('resolves with an error when session is not available', function(){
      const adapter = this.subject();
      const firebaseMock = {
        getAuth: sinon.stub().returns(null)
      };
      adapter.set('firebase', firebaseMock);

      const result = adapter.fetch();
      assert.ok(result instanceof Ember.RSVP.Promise, 'return is a promise');
      result.catch(function(reason){
        assert.ok(reason, 'provides fail reason');
      });
    });
  });

  describe('#close', function(){
    it('calls firebase.unauth()', function(){
      const adapter = this.subject();
      const firebaseMock = {
        unauth: sinon.stub()
      };
      adapter.set('firebase', firebaseMock);

      const result = adapter.close();
      assert.ok(result instanceof Ember.RSVP.Promise, 'return is a promise');
      assert.ok(firebaseMock.unauth.calledOnce, "unauth was called");
    });
  });
});
