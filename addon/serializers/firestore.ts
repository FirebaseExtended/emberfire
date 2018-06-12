import DS from 'ember-data';

export default class Firestore extends DS.JSONSerializer {

  extractAttributes(_modelClass: {}, resourceHash: any) {
    return resourceHash.data();
  }

  extractRelationships(modelClass: any, resourceHash: any) {
    return extractRelationships(modelClass, resourceHash.data());
  }

  extractMeta(_store: DS.Store, _modelClass: {}, payload: any) {
    const metadata : {[field:string]: any} = {};
    payload.forEach(doc => metadata[doc.id] = doc.metadata);
    if (payload.__query__) {
      metadata.query = payload.__query__;
      delete payload.__query__;
    }
    return metadata;
  }    

};

declare module 'ember-data' {
  interface SerializerRegistry {
    'firestore': Firestore;
  }
}

// TODO: same as database, extract to utils
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