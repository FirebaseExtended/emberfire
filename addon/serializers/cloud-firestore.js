import DS from 'ember-data';

export default DS.JSONSerializer.extend({

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
    if (payload.__query__) {
      const query = payload.__query__;
      delete payload.__query__;
      return { query };
    }
  }    

});