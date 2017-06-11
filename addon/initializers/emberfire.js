import Ember from 'ember';
import DS from 'ember-data';
import firebase from 'firebase';
import FirebaseAdapter from '../adapters/firebase';
import FirebaseSerializer from '../serializers/firebase';

var VERSION = '0.0.0';

if (Ember.libraries) {
  if (firebase.SDK_VERSION) {
    Ember.libraries.registerCoreLibrary('Firebase', firebase.SDK_VERSION);
  }

  Ember.libraries.registerCoreLibrary('EmberFire', VERSION);
}

export default {
  name: 'emberfire',
  before: 'ember-data',
  initialize() {

    // To support Ember versions below 2.1.0 as well.
    // See http://emberjs.com/deprecations/v2.x/#toc_initializer-arity
    let application = arguments[1] || arguments[0];

    application.register('adapter:-firebase', FirebaseAdapter);
    application.register('serializer:-firebase', FirebaseSerializer);

    const providerSettings = {instantiate: false, singleton: false};
    application.register('firebase-auth-provider:twitter',
        firebase.auth.TwitterAuthProvider, providerSettings);
    application.register('firebase-auth-provider:facebook',
        firebase.auth.FacebookAuthProvider, providerSettings);
    application.register('firebase-auth-provider:github',
        firebase.auth.GithubAuthProvider, providerSettings);
    application.register('firebase-auth-provider:google',
        firebase.auth.GoogleAuthProvider, providerSettings);

    // Monkeypatch the store until ED gives us a good way to listen to push events
    if (!DS.Store.prototype._emberfirePatched) {
      DS.Store.reopen({
        _emberfirePatched: true,

        _emberfireHandleRecordPush(records) {
          if (typeof records !== 'undefined') {
            records.forEach((record) => {
              var modelName = record.constructor.modelName;
              var adapter = this.adapterFor(modelName);
              if (adapter.recordWasPushed) {
                adapter.recordWasPushed(this, modelName, record);
              }
            });
          }
        },

        push() {
          var result = this._super.apply(this, arguments);
          var records = result;

          if (records === null) {
            return null;
          }

          if (!Ember.isArray(result)) {
            records = [result];
          }

          this._emberfireHandleRecordPush(records);
          return result;
        },

        _push() {
          var pushed = this._super.apply(this, arguments);
          var records;
          if (Array.isArray(pushed)) {
            records = pushed.map(function(internalModel) {
              return internalModel.getRecord();
            });
          } else if (pushed) {
            records = [pushed.getRecord()];
          }
          this._emberfireHandleRecordPush(records);
          return pushed;
        },

        recordWillUnload(record) {
          var adapter = this.adapterFor(record.constructor.modelName);
          if (adapter.recordWillUnload) {
            adapter.recordWillUnload(this, record);
          }
        },

        recordWillDelete(record) {
          var adapter = this.adapterFor(record.constructor.modelName);
          if (adapter.recordWillDelete) {
            adapter.recordWillDelete(this, record);
          }
        }
      });
    }

    if (!DS.Model.prototype._emberfirePatched) {
      DS.Model.reopen({
        _emberfirePatched: true,

        unloadRecord() {
          this.store.recordWillUnload(this);
          return this._super();
        },

        deleteRecord() {
          this.store.recordWillDelete(this);
          this._super();
        },

        ref() {
          var adapter = this.store.adapterFor(this.constructor.modelName);
          if (adapter._getAbsoluteRef) {
            return adapter._getAbsoluteRef(this);
          }
        }
      });
    }

    if (!DS.AdapterPopulatedRecordArray.prototype._emberfirePatched) {
      DS.AdapterPopulatedRecordArray.reopen({
        _emberfirePatched: true,

        willDestroy() {
          if (this.__firebaseCleanup) {
            this.__firebaseCleanup();
          }
          return this._super();
        }
      });
    }

    DS.FirebaseAdapter = FirebaseAdapter;
    DS.FirebaseSerializer = FirebaseSerializer;
  }
};
