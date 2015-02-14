import Ember from 'ember';
import DS from 'ember-data';
import FirebaseAdapter from 'emberfire/adapters/firebase';
import FirebaseSerializer from 'emberfire/serializers/firebase';

export default {
  name: 'emberfire',
  initialize: function (container, app) {
    app.register('adapter:-firebase', FirebaseAdapter);
    app.register('serializer:-firebase', FirebaseSerializer);

    var VERSION = '0.0.0';

    if (Ember.libraries) {
      Ember.libraries.registerCoreLibrary('EmberFire', VERSION);
    }

    // Monkeypatch the store until ED gives us a good way to listen to push events
    DS.Store.reopen({
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
      }
    });

    DS.Model.reopen({
      unloadRecord: function() {
        this.store.recordWillUnload(this);
        return this._super();
      }
    });

    DS.FirebaseAdapter = FirebaseAdapter;
    DS.FirebaseSerializer = FirebaseSerializer;
  }
};
