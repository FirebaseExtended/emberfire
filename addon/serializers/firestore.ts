import DS from 'ember-data';
import { firestore } from 'firebase/app';
// @ts-ignore
import { singularize } from 'ember-inflector';

export type DocumentSnapshot = firestore.DocumentSnapshot | firestore.QueryDocumentSnapshot;
export type Snapshot = firestore.DocumentSnapshot | firestore.QuerySnapshot;

// TODO aside from .data(), key vs. id, metadata, and subcollection this is basicly realtime-database, should refactor to reuse
export default class FirestoreSerializer extends DS.JSONSerializer {

  // @ts-ignore TODO update the types to support
  applyTransforms: (a: DS.Model, b: any) => void;

  normalizeSingleResponse(store: DS.Store, primaryModelClass: DS.Model, payload: firestore.DocumentSnapshot, _id: string | number, _requestType: string) {
    if (!payload.exists) { throw  new DS.NotFoundError(); }
    const meta = extractMeta(payload);
    let normalized = normalize(store, primaryModelClass, payload);
    this.applyTransforms(primaryModelClass, normalized.data.attributes);
    return { ...normalized, meta };
  }

  normalizeArrayResponse(store: DS.Store, primaryModelClass: DS.Model, payload: firestore.QuerySnapshot, _id: string | number, _requestType: string) {
    const normalizedPayload = payload.docs.map(snapshot => {
      let normalized = normalize(store, primaryModelClass, snapshot);
      this.applyTransforms(primaryModelClass, normalized.data.attributes);
      return normalized;
    });
    const included = new Array().concat(...normalizedPayload.map(({included}) => included));
    const meta = extractMeta(payload)
    const data = normalizedPayload.map(({data}) => data);
    return { data, included, meta };
  }

  normalizeCreateRecordResponse(_store: DS.Store, primaryModelClass: DS.Model, payload: any, id: string | number, _requestType: string) {
    return { data: { id: id || payload.doc.id, attributes: payload.data, type: primaryModelClass.modelName }};
  }

}

declare module 'ember-data' {
  interface SerializerRegistry {
    'firestore': FirestoreSerializer;
  }
}

function isQuerySnapshot(arg: any): arg is firestore.QuerySnapshot {
  return arg.query !== undefined;
}

const extractMeta = (snapshot: firestore.DocumentSnapshot|firestore.QuerySnapshot) => {
  if (isQuerySnapshot(snapshot)) {
    const query = snapshot.query;
    return { ...snapshot.metadata, query };
  } else {
    return snapshot.metadata;
  }
}

const normalizeRelationships = (store: DS.Store, modelClass: DS.Model, attributes: any) => {
  const relationships: {[field:string]: any} = {};
  const included: any[] = [];
  modelClass.eachRelationship((key: string, relationship: any) => {
    const attribute = attributes.data()[key];
    const payload = attributes._document && attributes._document._included && attributes._document._included[key];
    if (payload) {
      const modelName = singularize(relationship.key) as never;
      const modelClass = store.modelFor(modelName);
      const serializer = store.serializerFor(modelName) as any;
      const { data } = relationship.kind === 'belongsTo' ? serializer.normalizeSingleResponse(store, modelClass, payload) : serializer.normalizeArrayResponse(store, modelClass, payload);
      if (Array.isArray(data)) {
        data.forEach((r:any) => {
          return included.splice(-1, 0, { links: { self: 'emberfire' }, ...r })
        });
      } else {
        included.splice(-1, 0, { links: { self: 'emberfire' }, ...data });
      }
    }
    relationships[key] = normalizeRealtionship(relationship)(store, attribute, relationship, included);
  }, null);
  return {relationships, included};
}

const normalizeRealtionship = (relationship: any) => {
  if (relationship.kind == 'belongsTo') {
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
      const snapshot = (({ id, data: () => val } as any) as DocumentSnapshot);
      const model = store.modelFor(relationship.type as never);
      const { data, included: includes } = normalize(store, model, snapshot);
      included.push(data);
      includes.forEach((record:any) => included.push(record));
    });
    const data = included
      .filter(record => record.type == relationship.type)
      .map(record => ({ id: record.id, type: record.type }));
    if (data.length > 0 ) {
      return { links: { related: 'emberfire' }, data };
    } else {
      return { links: { related: 'emberfire' } };
    }
  } else {
    return { };
  }
}

const normalizeHasMany = (_store: DS.Store, _payload: firestore.QuerySnapshot, relationship: any, included: any[]) => {
  const relevantIncluded = included.filter(i => i.type == singularize(relationship.key));
  const data = relevantIncluded.map((r:any) => ({ type: r.type, id: r.id }));
  if (data.length > 0) {
    return { links: { related: 'emberfire' }, data };
  } else {
    return { links: { related: 'emberfire' } };
  }
}

export const normalize = (store: DS.Store, modelClass: DS.Model, snapshot: DocumentSnapshot) => {
  const id = snapshot.id;
  const type = (<any>modelClass).modelName;
  const _ref = snapshot.ref;
  const attributes = { ...snapshot.data()!, _ref };
  const { relationships, included } = normalizeRelationships(store, modelClass, snapshot);
  const data = { id, type, attributes, relationships };
  return { data, included };
}
