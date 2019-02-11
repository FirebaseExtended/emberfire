
#  EmberFire

## Index

### Enumerations

* [OrderBy](enums/orderby.md)

### Classes

* [FirebaseAppService](classes/firebaseappservice.md)
* [FirebaseAuthenticator](classes/firebaseauthenticator.md)
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

* [BoundOp](#boundop)
* [CollectionReferenceOrQuery](#collectionreferenceorquery)
* [DocumentSnapshot](#documentsnapshot)
* [OrderOp](#orderop)
* [QueryFn](#queryfn)
* [QueryOptions](#queryoptions)
* [QueryOptionsOnlyQuery](#queryoptionsonlyquery)
* [QueryRecordFn](#queryrecordfn)
* [QueryRecordOptions](#queryrecordoptions)
* [ReferenceOrQuery](#referenceorquery)
* [ReferenceOrQueryFn](#referenceorqueryfn)
* [Snapshot](#snapshot)
* [WhereOp](#whereop)

### Functions

* [normalize](#normalize)
* [subscribe](#subscribe)
* [unsubscribe](#unsubscribe)

---

## Type aliases

<a id="boundop"></a>

###  BoundOp

**Ƭ BoundOp**: *`string` \| `number` \| `boolean` \| `null` \| [`string` \| `number` \| `boolean` \| `null`, `string`]*

*Defined in [adapters/firestore.ts:205](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L205)*
*Defined in [adapters/realtime-database.ts:168](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/realtime-database.ts#L168)*

___
<a id="collectionreferenceorquery"></a>

###  CollectionReferenceOrQuery

**Ƭ CollectionReferenceOrQuery**: *`CollectionReference` \| `Query`*

*Defined in [adapters/firestore.ts:199](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L199)*

___
<a id="documentsnapshot"></a>

###  DocumentSnapshot

**Ƭ DocumentSnapshot**: *`DocumentSnapshot` \| `QueryDocumentSnapshot`*

*Defined in [serializers/firestore.ts:4](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/serializers/firestore.ts#L4)*

___
<a id="orderop"></a>

###  OrderOp

**Ƭ OrderOp**: *`string` \| `object`*

*Defined in [adapters/firestore.ts:204](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L204)*

___
<a id="queryfn"></a>

###  QueryFn

**Ƭ QueryFn**: *`function`*

*Defined in [adapters/firestore.ts:200](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L200)*
*Defined in [adapters/realtime-database.ts:163](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/realtime-database.ts#L163)*

#### Type declaration
▸(ref: *`Reference`*): [ReferenceOrQuery](#referenceorquery)

**Parameters:**

| Name | Type |
| ------ | ------ |
| ref | `Reference` |

**Returns:** [ReferenceOrQuery](#referenceorquery)

___
<a id="queryoptions"></a>

###  QueryOptions

**Ƭ QueryOptions**: *`object` \| `object` & `object`*

*Defined in [adapters/firestore.ts:212](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L212)*
*Defined in [adapters/realtime-database.ts:175](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/realtime-database.ts#L175)*

___
<a id="queryoptionsonlyquery"></a>

###  QueryOptionsOnlyQuery

**Ƭ QueryOptionsOnlyQuery**: *`object`*

*Defined in [adapters/firestore.ts:207](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L207)*
*Defined in [adapters/realtime-database.ts:170](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/realtime-database.ts#L170)*

#### Type declaration

___
<a id="queryrecordfn"></a>

###  QueryRecordFn

**Ƭ QueryRecordFn**: *`function`*

*Defined in [adapters/firestore.ts:201](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L201)*

#### Type declaration
▸(ref: *`CollectionReference`*): `DocumentReference`

**Parameters:**

| Name | Type |
| ------ | ------ |
| ref | `CollectionReference` |

**Returns:** `DocumentReference`

___
<a id="queryrecordoptions"></a>

###  QueryRecordOptions

**Ƭ QueryRecordOptions**: *`object`*

*Defined in [adapters/firestore.ts:223](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L223)*

#### Type declaration

___
<a id="referenceorquery"></a>

###  ReferenceOrQuery

**Ƭ ReferenceOrQuery**: *`Reference` \| `Query`*

*Defined in [adapters/realtime-database.ts:161](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/realtime-database.ts#L161)*

___
<a id="referenceorqueryfn"></a>

###  ReferenceOrQueryFn

**Ƭ ReferenceOrQueryFn**: *`function`*

*Defined in [adapters/realtime-database.ts:162](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/realtime-database.ts#L162)*

#### Type declaration
▸(ref: *[ReferenceOrQuery](#referenceorquery)*): [ReferenceOrQuery](#referenceorquery)

**Parameters:**

| Name | Type |
| ------ | ------ |
| ref | [ReferenceOrQuery](#referenceorquery) |

**Returns:** [ReferenceOrQuery](#referenceorquery)

___
<a id="snapshot"></a>

###  Snapshot

**Ƭ Snapshot**: *`DocumentSnapshot` \| `QuerySnapshot`*

*Defined in [serializers/firestore.ts:5](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/serializers/firestore.ts#L5)*

___
<a id="whereop"></a>

###  WhereOp

**Ƭ WhereOp**: *[`string` \| `FieldPath`, `firestore.WhereFilterOp`, `any`]*

*Defined in [adapters/firestore.ts:203](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L203)*

___

## Functions

<a id="normalize"></a>

### `<Const>` normalize

▸ **normalize**(store: *`Store`*, modelClass: *`Model`*, snapshot: *[DocumentSnapshot](#documentsnapshot)*): `object`

▸ **normalize**(store: *`Store`*, modelClass: *`Model`*, snapshot: *`DataSnapshot`*): `object`

*Defined in [serializers/firestore.ts:32](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/serializers/firestore.ts#L32)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| modelClass | `Model` |
| snapshot | [DocumentSnapshot](#documentsnapshot) |

**Returns:** `object`

*Defined in [serializers/realtime-database.ts:31](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/serializers/realtime-database.ts#L31)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| modelClass | `Model` |
| snapshot | `DataSnapshot` |

**Returns:** `object`

___
<a id="subscribe"></a>

### `<Const>` subscribe

▸ **subscribe**(route: *`Object`*, model: *`Model`*): `false` \| `void`

*Defined in [services/realtime-listener.ts:18](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/services/realtime-listener.ts#L18)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| route | `Object` |
| model | `Model` |

**Returns:** `false` \| `void`

___
<a id="unsubscribe"></a>

### `<Const>` unsubscribe

▸ **unsubscribe**(route: *`Object`*): `false` \| `void`

*Defined in [services/realtime-listener.ts:19](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/services/realtime-listener.ts#L19)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| route | `Object` |

**Returns:** `false` \| `void`

___

