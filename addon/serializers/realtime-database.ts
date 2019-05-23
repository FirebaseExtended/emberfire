import DS from 'ember-data';

import { database } from 'firebase/app';

export default class RealtimeDatabaseSerializer extends DS.JSONSerializer {

  normalizeSingleResponse(store: DS.Store, primaryModelClass: DS.Model, payload: database.DataSnapshot, _id: string | number, _requestType: string) {
    if (!payload.exists) { throw  new DS.NotFoundError(); }
    return normalize(store, primaryModelClass, payload);
  }

  normalizeArrayResponse(store: DS.Store, primaryModelClass: DS.Model, payload: database.DataSnapshot, _id: string | number, _requestType: string) {
    const noramlizedRecords: any[] = []
    const embeddedRecords: any[] = [];
    payload.forEach(snapshot => {
      const { data, included } = normalize(store, primaryModelClass, snapshot);
      noramlizedRecords.push(data);
      Object.assign(embeddedRecords, [...embeddedRecords, ...included]);
    });
    return { data: noramlizedRecords, included: embeddedRecords, meta: { query: (payload as any).query || payload.ref } };
  }

}

declare module 'ember-data' {
  interface SerializerRegistry {
    'realtime-database': RealtimeDatabaseSerializer;
  }
}

export const normalize = (store: DS.Store, modelClass: DS.Model, snapshot: database.DataSnapshot) => {
  const id = snapshot.key;
  const type = (<any>modelClass).modelName;
  const attributes = { ...snapshot.val(), _ref: snapshot.ref };
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
  } else if (relationship.options.embedded) {
    return normalizeEmbedded;
  } else {
    return normalizeHasMany;
  }
}

const normalizeBelongsTo = (_store: DS.Store, attribute: any, relationship: any, _included: any[]) => {
  if (attribute) {
    return { data: { id: attribute, type: relationship.type } };
  } else {
    return { };
  }
}

const normalizeEmbedded = (store: DS.Store, attribute: any, relationship: any, included: any[]) => {
  if (attribute) {
    Object.keys(attribute).forEach(key => {
      const val = attribute[key];
      const snapshot = { key, val: () => val } as database.DataSnapshot;
      const model = store.modelFor(relationship.type as never);
      const { data, included: includes } = normalize(store, model, snapshot);
      included.push(data);
      includes.forEach(record => included.push(record));
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
  ({ links: { related: 'emberfire' } })