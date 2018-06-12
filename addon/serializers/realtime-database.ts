import DS from 'ember-data';

export default class RealtimeDatabase extends DS.JSONSerializer {

  extractId(_modelClass: {}, resourceHash: any) {
    return resourceHash.key;
  }

  extractAttributes(modelClass: {}, resourceHash: any) {
    return this._super(modelClass, resourceHash.val());
  }

  extractRelationships(modelClass: any, resourceHash: any) {
    return extractRelationships(modelClass, resourceHash.val());
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

const extractRelationships = (modelClass: any, snapshotValue: any) => {
    let relationships: {[field:string]: any} = {};
    modelClass.eachRelationship((key: string, relationshipMeta: any) => {
      if (relationshipMeta.kind == 'belongsTo') {
        const data = { id: snapshotValue[key], type: relationshipMeta.type };
        relationships[key] = { data };
      } else {
        relationships[key] = { links: { related: 'HACK!' } };
      }
    });
    return relationships;
}