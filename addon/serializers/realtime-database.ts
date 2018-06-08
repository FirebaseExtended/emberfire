import DS from 'ember-data';

export default class RealtimeDatabase extends DS.JSONSerializer {

  extractId(_modelClass: {}, resourceHash: any) {
    return resourceHash.key;
  }

  extractAttributes(modelClass: {}, resourceHash: any) {
    return this._super(modelClass, resourceHash.val());
  }

  extractRelationships(modelClass: any, resourceHash: any) {
    let relationships = this._super(modelClass, resourceHash.val());
    modelClass.eachRelationship((key:any, relationshipMeta:any) => {
      if (relationshipMeta.kind === 'hasMany') {
        let relationship = relationships[key] || {};
        relationship.links = { related: 'HACK!' }
        relationships[key] = relationship;
      }
    });
    return relationships;
  }

  extractMeta(_store: DS.Store, _modelClass: {}, payload: any) {
    if (payload.$query) {
      const query = payload.$query;
      delete payload.$query;
      return { query };
    } else {
      return { };
    }
  }    

};

declare module 'ember-data' {
  interface SerializerRegistry {
    'realtime-database': RealtimeDatabase;
  }
}