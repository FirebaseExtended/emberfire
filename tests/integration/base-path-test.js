import Ember from 'ember';
import startApp from 'dummy/tests/helpers/start-app';
import destroyApp from 'dummy/tests/helpers/destroy-app';
import { it } from 'mocha';
import { expect } from 'chai';
import config from '../../config/environment';

const { set } = Ember;

describe('Integration: FirebaseAdapter - Base Path', function() {
  var app, store, adapter;

  beforeEach(function() {
    set(config, 'firebase.basePath','base/path');
    app = startApp();

    store = app.__container__.lookup('service:store');
    adapter = store.adapterFor('application');
  });

  afterEach(function() {
    destroyApp(app);
    set(config, 'firebase.basePath', undefined);
  });

  describe('#init()', function() {
    it('has a Firebase ref', function() {
      expect(adapter._ref !== undefined, 'ref is defined').to.be.ok;
    });
  });

  describe('#_getCollectionRef()', function() {
    it('returns the correct Firebase ref for a type', function() {
      var ref = adapter._getCollectionRef(store.modelFor('post'));
      expect(ref.toString()).to.match(/base\/path\/posts$/g);
    });

    it('returns the correct Firebase ref for a type and id', function() {
      var ref = adapter._getCollectionRef(store.modelFor('post'), 'post_1');
      expect(ref.toString()).to.match(/base\/path\/posts\/post_1$/g);
    });

  });
});
