import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';
import sinon from 'sinon';

const { run } = Ember;

describeModule('emberfire@torii-adapter:firebase', 'FirebaseToriiAdapter', {}, function() {

  const firebaseAppMock = {
    auth() { return authMock; }
  };

  const authMock = {
    getRedirectResult() {},
    onAuthStateChanged() {},
    signInAnonymously() {},
    signInWithPopup() {},
    signInWithCustomToken() {},
    signOut() {}
  };

  beforeEach(function() {
    this.registry.register(
        'service:firebaseApp', firebaseAppMock, {instantiate: false, singleton: true});
  });

  describe('#open', function() {

    it('returns a promise', function() {
      const adapter = this.subject();
      const currentUser = {
        displayName: 'bob',
        providerData: [{ providerId: 'p' }]
      };

      run(function() {
        const result = adapter.open(currentUser);
        assert.ok(result instanceof Ember.RSVP.Promise, 'returns a promise');
      });
    });

    it('extracts provider id from the user', function(done) {
      const adapter = this.subject();
      const currentUser = {
        displayName: 'bob',
        providerData: [{ providerId: 'p' }]
      };

      run(function() {
        const result = adapter.open(currentUser);
        result.then(function(session) {
          assert.equal(session.provider, 'p', 'provider is correct');
          assert.deepEqual(session.currentUser, currentUser);
          done();
        });
      });
    });

    it('sets provider id to anonymous if `user.isAnonymous`', function(done) {
      const adapter = this.subject();
      const currentUser = {
        displayName: 'bob',
        isAnonymous: true,
        providerData: [{ providerId: 'p' }]
      };

      run(function() {
        const result = adapter.open(currentUser);
        result.then(function(session) {
          assert.equal(session.provider, 'anonymous', 'provider is correct');
          done();
        });
      });
    });

    it('sets provider id to `custom` if no provider found', function(done) {
      const adapter = this.subject();
      const currentUser = {
        displayName: 'bob',
        isAnonymous: false,
        providerData: []
      };

      run(function() {
        const result = adapter.open(currentUser);
        result.then(function(session) {
          assert.equal(session.provider, 'custom', 'provider is correct');
          done();
        });
      });
    });

    it('extracts uid from the user', function(done) {
      const adapter = this.subject();
      const currentUser = {
        displayName: 'bob',
        uid: 'xx',
        isAnonymous: true,
        providerData: [{ providerId: 'p' }]
      };

      run(function() {
        const result = adapter.open(currentUser);
        result.then(function(session) {
          assert.equal(session.uid, 'xx', 'uid is present');
          done();
        });
      });
    });

    it('embeds the entire user object as `currentUser`', function(done) {
      const adapter = this.subject();
      const currentUser = {
        displayName: 'bob',
        uid: 'xx',
        isAnonymous: true,
        providerData: [{ providerId: 'p' }]
      };

      run(function() {
        const result = adapter.open(currentUser);
        assert.ok(result instanceof Ember.RSVP.Promise, 'return is a promise');
        result.then(function(session) {
          assert.deepEqual(session.currentUser, currentUser);
          done();
        });
      });
    });

  });  // #open


  describe('#fetch', function() {

    it('returns session information when user logged in', function(done) {
      const currentUser = {uid: 'bob', providerData: [{providerId: 'twitter.com'}]};
      const redirectStub =
          sinon.stub(authMock, 'getRedirectResult')
              .returns(Ember.RSVP.resolve(null));

      const authStateStub =
          sinon.stub(authMock, 'onAuthStateChanged')
              .returns(() => {})  // unsub
              .yieldsAsync(currentUser);


      const adapter = this.subject();
      run(function() {
        const result = adapter.fetch();
        result.then(function(session) {
          assert.equal(session.provider, 'twitter.com', 'provider is passed to resolved value');
          assert.equal(session.uid, 'bob', 'uid is passed to resolved value');
          assert.deepEqual(session.currentUser, currentUser);
          authStateStub.restore();
          redirectStub.restore();
          done();
        });
      });
    });

    it('returns session information from successful redirect login', function(done) {
      const currentUser = {uid: 'bob', providerData: [{providerId: 'twitter.com'}]};
      const redirectStub =
          sinon.stub(authMock, 'getRedirectResult')
              .returns(Ember.RSVP.resolve({user: currentUser}));

      const authStateStub = sinon.stub(authMock, 'onAuthStateChanged')
          .returns(() => {})  // unsub
          .yieldsAsync(null);


      const adapter = this.subject();
      run(function() {
        const result = adapter.fetch();
        result.then(function(session) {
          assert.equal(session.provider, 'twitter.com', 'provider is passed to resolved value');
          assert.equal(session.uid, 'bob', 'uid is passed to resolved value');
          assert.deepEqual(session.currentUser, currentUser);
          redirectStub.restore();
          authStateStub.restore();
          done();
        });
      });
    });

    it('resolves without checking redirect state if auth state is found', function(done) {
      const currentUser = {uid: 'bob', providerData: [{providerId: 'twitter.com'}]};
      const redirectStub =
          sinon.stub(authMock, 'getRedirectResult')
              .returns(Ember.RSVP.resolve(null));

      const authStateStub = sinon.stub(authMock, 'onAuthStateChanged')
          .returns(() => {})  // unsub
          .yieldsAsync(currentUser);


      const adapter = this.subject();
      run(function() {
        const result = adapter.fetch();
        result.then(function(session) {
          assert.equal(session.uid, 'bob', 'uid is passed to resolved value');
          assert.ok(redirectStub.notCalled, 'redir check should not be called');
          redirectStub.restore();
          authStateStub.restore();
          done();
        });
      });
    });

    it('checks redirect state only if auth state is empty', function(done) {
      const currentUser = {uid: 'bob', providerData: [{providerId: 'twitter.com'}]};
      const redirectStub =
          sinon.stub(authMock, 'getRedirectResult')
              .returns(Ember.RSVP.resolve({user: currentUser}));

      const authStateStub = sinon.stub(authMock, 'onAuthStateChanged')
          .returns(() => {})  // unsub
          .yieldsAsync(null);


      const adapter = this.subject();
      run(function() {
        const result = adapter.fetch();
        result.then(function(error) {
          assert.ok(redirectStub.called, 'redir check should be called');
          redirectStub.restore();
          authStateStub.restore();
          done();
        });
      });
    });

    it('rejects when redirect check rejects', function(done) {
      const redirectStub =
          sinon.stub(authMock, 'getRedirectResult')
              .returns(Ember.RSVP.reject());

      const authStateStub = sinon.stub(authMock, 'onAuthStateChanged')
          .returns(() => {})  // unsub
          .yieldsAsync(null);


      const adapter = this.subject();
      run(function() {
        const result = adapter.fetch();
        result.catch(function(error) {
          assert.ok(true, 'rejected');
          redirectStub.restore();
          authStateStub.restore();
          done();
        });
      });
    });

    it('rejects when session is null', function(done) {
      const redirectStub =
          sinon.stub(authMock, 'getRedirectResult')
              .returns(Ember.RSVP.resolve({user: null}));

      const authStateStub =
          sinon.stub(authMock, 'onAuthStateChanged')
              .returns(() => {})  // unsub
              .yieldsAsync(null);

      const adapter = this.subject();
      run(function() {
        const result = adapter.fetch();
        result.catch(function(reason) {
          assert.equal(reason.message, 'No session available', 'provides fail reason');
          authStateStub.restore();
          redirectStub.restore();
          done();
        });
      });
    });

    it('rejects when auth state fetch fails', function(done) {
      const redirectStub =
          sinon.stub(authMock, 'getRedirectResult')
              .returns(Ember.RSVP.resolve({user: null}));

      const authStateStub =
          sinon.stub(authMock, 'onAuthStateChanged')
              .returns(() => {})  // unsub
              .callsArgWithAsync(1, 'error');

      const adapter = this.subject();
      run(function() {
        const result = adapter.fetch();
        result.catch(function(reason) {
          assert.equal(reason, 'error', 'provides fail reason');
          authStateStub.restore();
          redirectStub.restore();
          done();
        });
      });
    });

    it('detaches auth listener when session fetched', function(done) {
      const unsub = sinon.spy();
      const redirectStub =
          sinon.stub(authMock, 'getRedirectResult')
              .returns(Ember.RSVP.resolve({user: null}));

      const authStateStub =
          sinon.stub(authMock, 'onAuthStateChanged')
              .returns(unsub)
              .yieldsAsync('user');

      const adapter = this.subject();
      run(function() {
        const result = adapter.fetch();
        result.then(function(session) {
          assert(unsub.called, 'unsub called');
          authStateStub.restore();
          redirectStub.restore();
          done();
        });
      });
    });

    it('detaches auth listener when session fetch fails', function(done) {
      const unsub = sinon.spy();
      const redirectStub =
          sinon.stub(authMock, 'getRedirectResult')
              .returns(Ember.RSVP.resolve({user: null}));

      const authStateStub =
          sinon.stub(authMock, 'onAuthStateChanged')
              .callsArgWithAsync(1, 'error')
              .returns(unsub);

      const adapter = this.subject();
      run(function() {
        const result = adapter.fetch();
        result.catch(function(reason) {
          assert(unsub.called, 'unsub called');
          authStateStub.restore();
          redirectStub.restore();
          done();
        });
      });
    });

  });  // #fetch


  describe('#close', function() {

    it('returns a promise', function() {
      const signOutStub =
          sinon.stub(authMock, 'signOut')
              .returns(Ember.RSVP.resolve());

      const adapter = this.subject();
      run(function() {
        const result = adapter.close();
        assert.ok(result instanceof Ember.RSVP.Promise, 'return is a promise');
        signOutStub.restore();
      });
    });

    it('calls auth.signOut()', function() {
      const signOutStub =
          sinon.stub(authMock, 'signOut')
              .returns(Ember.RSVP.resolve());

      const adapter = this.subject();
      run(function() {
        adapter.close();
        assert.ok(signOutStub.calledOnce, 'signOut was called');
        signOutStub.restore();
      });
    });

  });  // #close

});
