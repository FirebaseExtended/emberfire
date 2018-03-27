import DS from 'ember-data';

export default DS.JSONSerializer.extend({

  extractId(modelClass, resourceHash) {
    return resourceHash.key;
  },

  extractAttributes(modelClass, resourceHash) {
    return this._super(modelClass, resourceHash.val());
  },

  extractRelationships(modelClass, resourceHash) {
    let relationships = this._super(modelClass, resourceHash.val());
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
    if (payload.$query) {
      const query = payload.$query;
      delete payload.$query;
      return { query };
    }
  }    

});