import Ember from 'ember';
import DS from 'ember-data';

export default function setupStore(options) {
  var container, registry;
  var env = {};
  options = options || {};

  if (Ember.Registry) {
    registry = env.registry = new Ember.Registry();
    container = env.container = registry.container();
  } else {
    container = env.container = new Ember.Container();
    registry = env.registry = container;
  }

  env.replaceContainerNormalize = function replaceContainerNormalize(fn) {
    if (env.registry) {
      env.registry.normalize = fn;
    } else {
      env.container.normalize = fn;
    }
  };

  var adapter = env.adapter = (options.adapter || '-default');
  delete options.adapter;

  if (typeof adapter !== 'string') {
    env.registry.register('adapter:-ember-data-test-custom', adapter);
    adapter = '-ember-data-test-custom';
  }

  for (var prop in options) {
    registry.register('model:' + Ember.String.dasherize(prop), options[prop]);
  }

  registry.register('service:store', DS.Store.extend({
    adapter: adapter
  }));

  registry.optionsForType('serializer', { singleton: false });
  registry.optionsForType('adapter', { singleton: false });
  registry.register('adapter:-default', DS.Adapter);

  registry.register('serializer:-default', DS.JSONSerializer);
  registry.register('serializer:-rest', DS.RESTSerializer);

  registry.register('adapter:-rest', DS.RESTAdapter);

  registry.register('adapter:-json-api', DS.JSONAPIAdapter);
  registry.register('serializer:-json-api', DS.JSONAPISerializer);

  registry.register('transform:string', DS.Transform.extend({
    deserialize: function(serialized) {
      return Ember.isNone(serialized) ? null : String(serialized);
    },
    serialize: function(deserialized) {
      return Ember.isNone(deserialized) ? null : String(deserialized);
    }
  }));

  function isNumber(value) {
    return value === value && value !== Infinity && value !== -Infinity;
  }

  registry.register('transform:number', DS.Transform.extend({
    deserialize: function(serialized) {
      var transformed;

      if (Ember.isEmpty(serialized)) {
        return null;
      } else {
        transformed = Number(serialized);

        return isNumber(transformed) ? transformed : null;
      }
    },

    serialize: function(deserialized) {
      var transformed;

      if (Ember.isEmpty(deserialized)) {
        return null;
      } else {
        transformed = Number(deserialized);

        return isNumber(transformed) ? transformed : null;
      }
    }
  }));

  env.restSerializer = container.lookup('serializer:-rest');
  env.store = container.lookup('service:store');
  env.serializer = env.store.serializerFor('-default');
  env.adapter = env.store.get('defaultAdapter');

  return env;
}

export {setupStore};

export function createStore(options) {
  return setupStore(options).store;
}
