import Ember from 'ember';
import DS from 'ember-data';
import Firebase from 'firebase';
import FirebaseAdapter from '../adapters/firebase';
import FirebaseSerializer from '../serializers/firebase';

var VERSION = '1.4.5';

if (Ember.libraries) {
  if (Firebase.SDK_VERSION) {
    Ember.libraries.registerCoreLibrary('Firebase', Firebase.SDK_VERSION);
  }

  Ember.libraries.registerCoreLibrary('EmberFire', VERSION);
}

export default {
  name: 'emberfire',
  before: 'ember-data',
  initialize: function (container, app) {
    app.register('adapter:-firebase', FirebaseAdapter);
    app.register('serializer:-firebase', FirebaseSerializer);

    // Monkeypatch the store until ED gives us a good way to listen to push events
    if (!DS.Store.prototype._emberfirePatched) {
      DS.Store.reopen({
        _emberfirePatched: true,
        push: function(typeName, data, _partial) {
          var record = this._super(typeName, data, _partial);
          var adapter = this.adapterFor(record.constructor);
          if (adapter.recordWasPushed) {
            adapter.recordWasPushed(this, typeName, record);
          }
          return record;
        },

        recordWillUnload: function(record) {
          var adapter = this.adapterFor(record.constructor);
          if (adapter.recordWillUnload) {
            adapter.recordWillUnload(this, record);
          }
        },

        recordWillDelete: function (record) {
          var adapter = this.adapterFor(record.constructor);
          if (adapter.recordWillDelete) {
            adapter.recordWillDelete(this, record);
          }
        }
      });
    }

    if (!DS.Model.prototype._emberfirePatched) {
      DS.Model.reopen({
        _emberfirePatched: true,
        unloadRecord: function() {
          this.store.recordWillUnload(this);
          return this._super();
        },
        deleteRecord: function () {
          this.store.recordWillDelete(this);
          this._super();
        }
      });
    }

    DS.FirebaseAdapter = FirebaseAdapter;
    DS.FirebaseSerializer = FirebaseSerializer;
  }
};
