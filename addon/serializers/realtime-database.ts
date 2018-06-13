import DS from 'ember-data';

import { database } from 'firebase';

export default class RealtimeDatabase extends DS.JSONSerializer {

  normalizeSingleResponse(store: DS.Store, primaryModelClass: DS.Model, payload: database.DataSnapshot, _id: string | number, _requestType: string) {
    if (!payload.exists) { throw  new DS.NotFoundError(); }
    const { data, included } = normalize(store, primaryModelClass, payload) as any;
    return { data, included, meta: {} };
  }

  normalizeArrayResponse(store: DS.Store, primaryModelClass: DS.Model, payload: database.DataSnapshot, _id: string | number, _requestType: string) {
    const noramlizedRecords: any[] = []
    const embeddedRecords: any[] = [];
    payload.forEach(snapshot => {
      const { data, included } = normalize(store, primaryModelClass, snapshot);
      noramlizedRecords.push(data);
      Object.assign(embeddedRecords, included);
    });
    return { data: noramlizedRecords, included: embeddedRecords, meta: {} };
  };

};

declare module 'ember-data' {
  interface SerializerRegistry {
    'realtime-database': RealtimeDatabase;
  }
}

const normalizeRelationships = (store: DS.Store, modelClass: DS.Model, attributes: any) => {
  const relationships: {[field:string]: any} = {};
  const embeddedRecords: any[] = [];
  
  modelClass.eachRelationship((key: string, relationshipMeta: any) => {
    const attribute = attributes[key];
    delete attributes[key];
    if (relationshipMeta.kind == 'belongsTo') {
      if (attribute) {
        const data = { id: attribute, type: relationshipMeta.type };
        relationships[key] = { data };
      }
    } else if (relationshipMeta.options.embedded) {
      Object.keys(attribute).forEach(id => {
        const val = attribute[id];
        const snapshot = { key: id, val: () => val } as database.DataSnapshot;
        const model = store.modelFor(relationshipMeta.type as never);
        // TODO handle embeds of embeds... woah
        // @ts-ignore
        const { data, included } = normalize(store, model, snapshot);
        embeddedRecords.push(data);
      });
      const data = embeddedRecords.map(record => ({ id: record.id, type: relationshipMeta.type }));
      relationships[key] = { links: { related: 'something' }, data };
    } else {
      // The string related here doesn't have to be anything in particular
      relationships[key] = { links: { related: 'something' } };
    }
  }, null);
  return {relationships, included: embeddedRecords};
}

const normalize = (store: DS.Store, modelClass: DS.Model, snapshot: database.DataSnapshot) => {
  const id = snapshot.key;
  const type = (<any>modelClass).modelName;
  const attributes = snapshot.val();
  const { relationships, included } = normalizeRelationships(store, modelClass, attributes);
  const data = { id, type, attributes, relationships };
  return { data, included };
}