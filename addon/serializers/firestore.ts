import DS from 'ember-data';

import { firestore } from 'firebase';

export type Snapshot = firestore.DocumentSnapshot | firestore.QueryDocumentSnapshot;

export default class Firestore extends DS.JSONSerializer {

  normalizeSingleResponse(_store: DS.Store, primaryModelClass: DS.Model, payload: firestore.DocumentSnapshot, _id: string | number, _requestType: string) {
    if (!payload.exists) { throw  new DS.NotFoundError(); }
    const data = normalize(primaryModelClass, payload) as any;
    return { data, included: [], meta: payload.metadata };
  }

  normalizeArrayResponse(_store: DS.Store, primaryModelClass: DS.Model, payload: firestore.QuerySnapshot, _id: string | number, _requestType: string) {
    const data = payload.docs.map(snapshot => normalize(primaryModelClass, snapshot));
    return { data, included: [], meta: payload.metadata };
  };

};

declare module 'ember-data' {
  interface SerializerRegistry {
    'firestore': Firestore;
  }
}

const normalizeRelationships = (modelClass: DS.Model, attributes: firestore.DocumentData) => {
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
      // TODO embedded vs. subcollection
      result[key] = { links: { related: 'something' } };
    }
  }, null);
  return result;
}

const normalize = (modelClass: DS.Model, snapshot: Snapshot) => {
  const id = snapshot.id;
  const type = (<any>modelClass).modelName;
  const attributes = snapshot.data()!;
  const relationships = normalizeRelationships(modelClass, attributes);
  return { id, type, attributes, relationships };
}