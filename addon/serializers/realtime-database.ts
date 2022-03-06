import DS from 'ember-data';
import JSONSerializer from '@ember-data/serializer/json';
import { database } from 'firebase/app';
import Model from '@ember-data/model';
import Store from '@ember-data/store';

export default class RealtimeDatabaseSerializer extends JSONSerializer {

  normalizeSingleResponse(store: Store, primaryModelClass: Model, payload: database.DataSnapshot, _id: string | number, _requestType: string) {
    if (!payload.exists) { throw  new DS.NotFoundError(); }
    let normalized = normalize(store, primaryModelClass, payload);
    //@ts-ignore
    this.applyTransforms(primaryModelClass, normalized.data.attributes);
    return normalized;
  }

  normalizeArrayResponse(store: Store, primaryModelClass: Model, payload: database.DataSnapshot, _id: string | number, _requestType: string) {
    const normalizedPayload: any[] = []
    payload.forEach(snapshot => {
      let normalized = normalize(store, primaryModelClass, snapshot);
      //@ts-ignore
      this.applyTransforms(primaryModelClass, normalized.data.attributes);
      normalizedPayload.push(normalized);
    });
    const included = new Array().concat(...normalizedPayload.map(({included}) => included));
    const meta = { query: (payload as any).query || payload.ref };
    const data = normalizedPayload.map(({data}) => data);
    return { data, included, meta };
  }

  normalizeCreateRecordResponse(_store: Store, _primaryModelClass: Model, payload: any, id: string | number, _requestType: string) {
    return { data: { id: id || payload.ref.key, attributes: payload.data }};
  }

}

declare module 'ember-data' {
  interface SerializerRegistry {
    'realtime-database': RealtimeDatabaseSerializer;
  }
}

export const normalize = (store: Store, modelClass: Model, snapshot: database.DataSnapshot) => {
  const id = snapshot.key;
  const type = (<any>modelClass).modelName;
  const attributes = { ...snapshot.val(), _ref: snapshot.ref };
  const { relationships, included } = normalizeRelationships(store, modelClass, attributes);
  const data = { id, type, attributes, relationships };
  return { data, included };
}

const normalizeRelationships = (store: Store, modelClass: Model, attributes: any) => {
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

const normalizeBelongsTo = (_store: Store, attribute: any, relationship: any, _included: any[]) => {
  if (attribute) {
    return { data: { id: attribute, type: relationship.type } };
  } else {
    return { };
  }
}

const normalizeEmbedded = (store: Store, attribute: any, relationship: any, included: any[]) => {
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

const normalizeHasMany = (_store: Store, _attribute: any, _relationship: any, _included: any[]) => 
  ({ links: { related: 'emberfire' } })