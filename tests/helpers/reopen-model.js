// TODO: this needs to be done in a way where an app.reset/destroy will destroy the changes
export default function reopenModel(app, modelName, attrs) {
  modelName = modelName.camelize();
  var resolverName = `model:${modelName}`;
  var Model = app.__container__.lookupFactory(resolverName);

  if (!Model) {
    throw new Error(`unable to find model definition for ${modelName}`);
  }

  // var NewModel = Model.extend(attrs);

  // app.__container__.unregister(resolverName);
  // app.__container__.register(resolverName, NewModel);
  // return NewModel;

  Model.reopen(attrs);

  return Model;
}
