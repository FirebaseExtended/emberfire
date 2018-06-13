import DS from 'ember-data';

import { database } from 'firebase';

export default class RealtimeDatabase extends DS.JSONSerializer {

  normalizeSingleResponse(_store: DS.Store, primaryModelClass: DS.Model, payload: database.DataSnapshot, _id: string | number, _requestType: string) {
    if (!payload.exists) { throw  new DS.NotFoundError(); }
    const data = normalize(primaryModelClass, payload) as any;
    return { data, included: [], meta: {} };
  }

  normalizeArrayResponse(_store: DS.Store, primaryModelClass: DS.Model, payload: database.DataSnapshot, _id: string | number, _requestType: string) {
    const data: any[] = []
    payload.forEach(snapshot => { data.push(normalize(primaryModelClass, snapshot)) });
    return { data, included: [], meta: {} };
  };

};

declare module 'ember-data' {
  interface SerializerRegistry {
    'realtime-database': RealtimeDatabase;
  }
}

const normalizeRelationships = (modelClass: DS.Model, attributes: any) => {
  const result: {[field:string]: any} = {};
  modelClass.eachRelationship((key: string, relationshipMeta: any) => {
    if (relationshipMeta.kind == 'belongsTo') {
      const id = attributes[key];
      if (id) {
        const data = { id, type: relationshipMeta.type };
        result[key] = { data };
      }
    } else {
      // The string related here doesn't have to be anything in particular
      // TODO embedded
      result[key] = { links: { related: 'something' } };
    }
  }, null);
  return result;
}

const normalize = (modelClass: DS.Model, snapshot: database.DataSnapshot) => {
  const id = snapshot.key;
  const type = (<any>modelClass).modelName;
  const attributes = snapshot.val()!;
  const relationships = normalizeRelationships(modelClass, attributes);
  return { id, type, attributes, relationships };
}