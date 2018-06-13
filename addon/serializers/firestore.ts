import DS from 'ember-data';

import { firestore } from 'firebase';

export type Snapshot = firestore.DocumentSnapshot | firestore.QueryDocumentSnapshot;

// TODO aside from .data(), key vs. id, metadata, and subcollection this is basicly realtime-database, should refactor to reuse
export default class Firestore extends DS.JSONSerializer {

  normalizeSingleResponse(store: DS.Store, primaryModelClass: DS.Model, payload:  firestore.DocumentSnapshot, _id: string | number, _requestType: string) {
    if (!payload.exists) { throw  new DS.NotFoundError(); }
    const { data, included } = normalize(store, primaryModelClass, payload) as any;
    return { data, included, meta: payload.metadata };
  }

  normalizeArrayResponse(store: DS.Store, primaryModelClass: DS.Model, payload: firestore.QuerySnapshot, _id: string | number, _requestType: string) {
    const noramlizedRecords: any[] = []
    const embeddedRecords: any[] = [];
    payload.forEach(snapshot => {
      const { data, included } = normalize(store, primaryModelClass, snapshot);
      noramlizedRecords.push(data);
      Object.assign(embeddedRecords, included);
    });
    return { data: noramlizedRecords, included: embeddedRecords, meta: payload.metadata };
  };

};

declare module 'ember-data' {
  interface SerializerRegistry {
    'firestore': Firestore;
  }
}

const normalize = (store: DS.Store, modelClass: DS.Model, snapshot: Snapshot) => {
  const id = snapshot.id;
  const type = (<any>modelClass).modelName;
  const attributes = snapshot.data()!;
  const { relationships, included } = normalizeRelationships(store, modelClass, attributes);
  const data = { id, type, attributes, relationships };
  return { data, included };
}

const normalizeRelationships = (store: DS.Store, modelClass: DS.Model, attributes: any) => {
  const relationships: {[field:string]: any} = {};
  const included: any[] = [];
  modelClass.eachRelationship((key: string, relationship: any) => {
    const attribute = attributes[key];
    delete attributes[key];
    relationships[key] = normalizeRealtionship(relationship)(store, attribute, relationship, included);
  }, null);
  return {relationships, included};
}

const normalizeRealtionship = (relationship: any) => {
  if (relationship.kind === 'belongsTo') {
    return normalizeBelongsTo;
  } else if (relationship.options.subcollection) {
    return normalizeHasMany; // this is handled in the adapter
  } else if (relationship.options.embedded) {
    return normalizeEmbedded;
  } else {
    return normalizeHasMany;
  }
}

const normalizeBelongsTo = (_store: DS.Store, id: any, relationship: any, _included: any[]) => {
  if (id) {
    return { data: { id, type: relationship.type }};
  } else {
    return { };
  }
}

const normalizeEmbedded = (store: DS.Store, attribute: any, relationship: any, included: any[]) => {
  if (attribute) {
    Object.keys(attribute).forEach(id => {
      const val = attribute[id];
      const snapshot = (({ id, data: () => val } as any) as Snapshot);
      const model = store.modelFor(relationship.type as never);
      const { data, included: includes } = normalize(store, model, snapshot);
      included.push(data);
      includes.forEach((record:any) => included.push(record));
    });
    const data = included
      .filter(record => record.type == relationship.type)
      .map(record => ({ id: record.id, type: record.type }));
    return { links: { related: 'emberfire' }, data };
  } else {
    return { };
  }
}

const normalizeHasMany = (_store: DS.Store, _attribute: any, _relationship: any, _included: any[]) => 
  ({ links: { related: 'emberfire' } });