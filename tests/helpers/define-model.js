import Ember from 'ember';
import DS from 'ember-data';

export default function defineModel(app, modelName, attrs) {
  modelName = Ember.String.camelize(modelName);
  var resolverName = `model:${modelName}`;

  var Model = DS.Model.extend(attrs);

  if (app.registry.resolve(resolverName)) {
    app.registry.unregister(resolverName);
  }
  app.registry.register(resolverName, Model);

  return Model;
}
