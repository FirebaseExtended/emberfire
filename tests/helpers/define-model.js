import Ember from 'ember';
import DS from 'ember-data';

export default function defineModel(app, modelName, attrs) {
  modelName = Ember.String.camelize(modelName);
  var resolverName = `model:${modelName}`;

  var Model = DS.Model.extend(attrs);

  if (app.__container__.resolve(resolverName)) {
    app.__container__.unregister(resolverName);
  }
  app.__container__.register(resolverName, Model);

  return Model;
}
