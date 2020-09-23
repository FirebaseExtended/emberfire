import DS from 'ember-data';

import { database } from 'firebase/app';

export default class RealtimeDatabaseSerializer extends DS.JSONSerializer {

  // @ts-ignore TODO update the types to support
  applyTransforms: (a: DS.Model, b: any) => void;

  normalizeSingleResponse(store: DS.Store, primaryModelClass: DS.Model, payload: database.DataSnapshot, _id: string | number, _requestType: string) {
    if (!payload.exists) { throw  new DS.NotFoundError(); }
    let normalized = normalize(store, primaryModelClass, payload);
    this.applyTransforms(primaryModelClass, normalized.data.attributes);
    return normalized;
  }

  normalizeArrayResponse(store: DS.Store, primaryModelClass: DS.Model, payload: database.DataSnapshot, _id: string | number, _requestType: string) {
    const normalizedPayload: any[] = []
    payload.forEach(snapshot => {
      let normalized = normalize(store, primaryModelClass, snapshot);
      this.applyTransforms(primaryModelClass, normalized.data.attributes);
      normalizedPayload.push(normalized);
    });
    const included = new Array().concat(...normalizedPayload.map(({included}) => included));
    const meta = { query: (payload as any).query || payload.ref };
    const data = normalizedPayload.map(({data}) => data);
    return { data, included, meta };
  }

  normalizeCreateRecordResponse(_store: DS.Store, _primaryModelClass: DS.Model, payload: any, id: string | number, _requestType: string) {
    return { data: { id: id || payload.ref.key, attributes: payload.data }};
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

const normalizeHasMany = (_store, _attribute, _relationship, _included) => {
    //taken from firestore
    var data = [];
    if(_attribute) {
        var idsForRelationships = Object.keys(_attribute);
        data = idsForRelationships.map( (key) => ({id: key, type: _relationship.type}) )
     }

    if (data.length > 0) {
        return { data };
    } else {
        data = [];
        return { data };
    }
}
