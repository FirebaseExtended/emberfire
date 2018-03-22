import Ember from 'ember';
import DS from 'ember-data';

import _ from 'npm:@firebase/firestore';

const { inject: { service }} = Ember;

export default DS.JSONSerializer.extend({

  firebase: service(),

  extractAttributes(modelClass, resourceHash) {
    return this._super(modelClass, resourceHash.data());
  },

  extractRelationships(modelClass, resourceHash) {
    let relationships = this._super(modelClass, resourceHash.data());
    modelClass.eachRelationship((key, relationshipMeta) => {
      if (relationshipMeta.kind === 'hasMany') {
        let relationship = relationships[key] || {};
        relationship.links = { related: 'HACK!' }
        relationships[key] = relationship;
      }
    });
    return relationships;
  },

  extractMeta(store, modelClass, payload) {
    if (payload.query) {
      const query = payload.query;
      delete payload.query;
      return { query };
    }
  }    

});