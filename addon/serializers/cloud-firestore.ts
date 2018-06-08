import DS from 'ember-data';

export default class CloudFirestore extends DS.JSONSerializer {

  extractAttributes(_modelClass: {}, resourceHash: any) {
    return resourceHash.data();
  }

  extractRelationships(modelClass: any, resourceHash: any) {
    let relationships = this._super(modelClass, resourceHash.data());
    modelClass.eachRelationship((key: any, relationshipMeta: any) => {
      if (relationshipMeta.kind === 'hasMany') {
        let relationship = relationships[key] || {};
        relationship.links = { related: 'HACK!' }
        relationships[key] = relationship;
      }
    });
    return relationships;
  }

  extractMeta(_store: DS.Store, _modelClass: {}, payload: any) {
    if (payload.__query__) {
      const query = payload.__query__;
      delete payload.__query__;
      return { query };
    } else {
      return { };
    }
  }    

};

declare module 'ember-data' {
  interface SerializerRegistry {
    'cloud-firestore': CloudFirestore;
  }
}