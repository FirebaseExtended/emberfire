import Ember from 'ember';

export default function(modelName) {
  return Ember.String.fmt('%@%@', [modelName, new Date().getTime()]);
}
