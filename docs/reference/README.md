
#  EmberFire

## Index

### Classes

* [FirebaseAppService](classes/firebaseappservice.md)
* [FirebaseAuthenticator](classes/firebaseauthenticator.md)
* [FirebaseAuthorizer](classes/firebaseauthorizer.md)
* [FirebaseService](classes/firebaseservice.md)
* [FirebaseSessionStore](classes/firebasesessionstore.md)
* [FirebaseToriiAdapter](classes/firebasetoriiadapter.md)
* [FirebaseToriiProvider](classes/firebasetoriiprovider.md)
* [FirestoreAdapter](classes/firestoreadapter.md)
* [FirestoreSerializer](classes/firestoreserializer.md)
* [RealtimeDatabaseAdapter](classes/realtimedatabaseadapter.md)
* [RealtimeDatabaseSerializer](classes/realtimedatabaseserializer.md)
* [RealtimeListenerService](classes/realtimelistenerservice.md)

### Type aliases

* [CollectionReferenceOrQuery](#collectionreferenceorquery)
* [DocumentSnapshot](#documentsnapshot)
* [QueryFn](#queryfn)
* [ReferenceOrQuery](#referenceorquery)
* [Snapshot](#snapshot)

### Variables

* [RealtimeRouteMixin](#realtimeroutemixin)

### Functions

* [normalize](#normalize)
* [subscribe](#subscribe)
* [unsubscribe](#unsubscribe)

---

## Type aliases

<a id="collectionreferenceorquery"></a>

###  CollectionReferenceOrQuery

**Ƭ CollectionReferenceOrQuery**: *`CollectionReference` \| `Query`*

*Defined in [adapters/firestore.ts:14](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L14)*

___
<a id="documentsnapshot"></a>

###  DocumentSnapshot

**Ƭ DocumentSnapshot**: *`DocumentSnapshot` \| `QueryDocumentSnapshot`*

*Defined in [serializers/firestore.ts:5](https://github.com/firebase/emberfire/blob/v3/addon/serializers/firestore.ts#L5)*

___
<a id="queryfn"></a>

###  QueryFn

**Ƭ QueryFn**: *`function`*

*Defined in [adapters/firestore.ts:15](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L15)*
*Defined in [adapters/realtime-database.ts:14](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L14)*

#### Type declaration
▸(ref: *[ReferenceOrQuery](#referenceorquery)*): [ReferenceOrQuery](#referenceorquery)

**Parameters:**

| Name | Type |
| ------ | ------ |
| ref | [ReferenceOrQuery](#referenceorquery) |

**Returns:** [ReferenceOrQuery](#referenceorquery)

___
<a id="referenceorquery"></a>

###  ReferenceOrQuery

**Ƭ ReferenceOrQuery**: *`Reference` \| `Query`*

*Defined in [adapters/realtime-database.ts:13](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L13)*

___
<a id="snapshot"></a>

###  Snapshot

**Ƭ Snapshot**: *`DocumentSnapshot` \| `QuerySnapshot`*

*Defined in [serializers/firestore.ts:6](https://github.com/firebase/emberfire/blob/v3/addon/serializers/firestore.ts#L6)*

___

## Variables

<a id="realtimeroutemixin"></a>

### `<Const>` RealtimeRouteMixin

**● RealtimeRouteMixin**: *`Mixin`<`object`, `EmberObject`>* =  Mixin.create({
    afterModel(model:DS.Model) {
        subscribe(this, model);
    },
    deactivate() {
        unsubscribe(this);
    }
})

*Defined in [services/realtime-listener.ts:10](https://github.com/firebase/emberfire/blob/v3/addon/services/realtime-listener.ts#L10)*

___

## Functions

<a id="normalize"></a>

### `<Const>` normalize

▸ **normalize**(store: *`Store`*, modelClass: *`Model`*, snapshot: *[DocumentSnapshot](#documentsnapshot)*): `object`

*Defined in [serializers/firestore.ts:39](https://github.com/firebase/emberfire/blob/v3/addon/serializers/firestore.ts#L39)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| modelClass | `Model` |
| snapshot | [DocumentSnapshot](#documentsnapshot) |

**Returns:** `object`

___
<a id="subscribe"></a>

### `<Const>` subscribe

▸ **subscribe**(route: *`Object`*, model: *`Model`*): `void`

*Defined in [services/realtime-listener.ts:31](https://github.com/firebase/emberfire/blob/v3/addon/services/realtime-listener.ts#L31)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| route | `Object` |
| model | `Model` |

**Returns:** `void`

___
<a id="unsubscribe"></a>

### `<Const>` unsubscribe

▸ **unsubscribe**(route: *`Object`*): `false` \| `void`

*Defined in [services/realtime-listener.ts:32](https://github.com/firebase/emberfire/blob/v3/addon/services/realtime-listener.ts#L32)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| route | `Object` |

**Returns:** `false` \| `void`

___

