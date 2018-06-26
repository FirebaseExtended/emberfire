[EmberFire](../README.md) > [FirestoreAdapter](../classes/firestoreadapter.md)

# Class: FirestoreAdapter

## Hierarchy

  `object` & `Adapter`<`this`>

**↳ FirestoreAdapter**

## Index

### Properties

* [defaultSerializer](firestoreadapter.md#defaultserializer)
* [enablePersistence](firestoreadapter.md#enablepersistence)
* [firebaseApp](firestoreadapter.md#firebaseapp)
* [firestore](firestoreadapter.md#firestore)
* [firestoreSettings](firestoreadapter.md#firestoresettings)

### Methods

* [createRecord](firestoreadapter.md#createrecord)
* [deleteRecord](firestoreadapter.md#deleterecord)
* [findAll](firestoreadapter.md#findall)
* [findBelongsTo](firestoreadapter.md#findbelongsto)
* [findHasMany](firestoreadapter.md#findhasmany)
* [findRecord](firestoreadapter.md#findrecord)
* [query](firestoreadapter.md#query)
* [shouldBackgroundReloadRecord](firestoreadapter.md#shouldbackgroundreloadrecord)
* [updateRecord](firestoreadapter.md#updaterecord)

---

## Properties

<a id="defaultserializer"></a>

###  defaultSerializer

**● defaultSerializer**: *`string`* = "-firestore"

*Defined in [adapters/firestore.ts:29](https://github.com/firebase/emberfire/blob/7728aa3/addon/adapters/firestore.ts#L29)*

___
<a id="enablepersistence"></a>

###  enablePersistence

**● enablePersistence**: *`boolean`*

*Defined in [adapters/firestore.ts:26](https://github.com/firebase/emberfire/blob/7728aa3/addon/adapters/firestore.ts#L26)*

___
<a id="firebaseapp"></a>

###  firebaseApp

**● firebaseApp**: *`ComputedProperty`<[FirebaseAppService](firebaseappservice.md), [FirebaseAppService](firebaseappservice.md)>*

*Defined in [adapters/firestore.ts:26](https://github.com/firebase/emberfire/blob/7728aa3/addon/adapters/firestore.ts#L26)*

___
<a id="firestore"></a>

### `<Optional>` firestore

**● firestore**: *`firestore.Firestore`*

*Defined in [adapters/firestore.ts:28](https://github.com/firebase/emberfire/blob/7728aa3/addon/adapters/firestore.ts#L28)*

___
<a id="firestoresettings"></a>

###  firestoreSettings

**● firestoreSettings**: *`Settings`*

*Defined in [adapters/firestore.ts:26](https://github.com/firebase/emberfire/blob/7728aa3/addon/adapters/firestore.ts#L26)*

___

## Methods

<a id="createrecord"></a>

###  createRecord

▸ **createRecord**(_store: *`Store`*, type: *`any`*, snapshot: *`Snapshot`<`never`>*): `Promise`< `void` &#124; `DocumentReference`>

*Defined in [adapters/firestore.ts:70](https://github.com/firebase/emberfire/blob/7728aa3/addon/adapters/firestore.ts#L70)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| _store | `Store` |
| type | `any` |
| snapshot | `Snapshot`<`never`> |

**Returns:** `Promise`< `void` &#124; `DocumentReference`>

___
<a id="deleterecord"></a>

###  deleteRecord

▸ **deleteRecord**(_store: *`Store`*, type: *`any`*, snapshot: *`Snapshot`<`never`>*): `Promise`<`void`>

*Defined in [adapters/firestore.ts:83](https://github.com/firebase/emberfire/blob/7728aa3/addon/adapters/firestore.ts#L83)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| _store | `Store` |
| type | `any` |
| snapshot | `Snapshot`<`never`> |

**Returns:** `Promise`<`void`>

___
<a id="findall"></a>

###  findAll

▸ **findAll**(_store: *`Store`*, type: *`any`*): `Promise`<`QuerySnapshot`>

*Defined in [adapters/firestore.ts:35](https://github.com/firebase/emberfire/blob/7728aa3/addon/adapters/firestore.ts#L35)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| _store | `Store` |
| type | `any` |

**Returns:** `Promise`<`QuerySnapshot`>

___
<a id="findbelongsto"></a>

###  findBelongsTo

▸ **findBelongsTo**(_store: *`Store`*, snapshot: *`Snapshot`<`never`>*, _url: *`any`*, relationship: *`any`*): `Promise`<`DocumentSnapshot`>

*Defined in [adapters/firestore.ts:52](https://github.com/firebase/emberfire/blob/7728aa3/addon/adapters/firestore.ts#L52)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| _store | `Store` |
| snapshot | `Snapshot`<`never`> |
| _url | `any` |
| relationship | `any` |

**Returns:** `Promise`<`DocumentSnapshot`>

___
<a id="findhasmany"></a>

###  findHasMany

▸ **findHasMany**(_store: *`Store`*, snapshot: *`Snapshot`<`never`>*, _url: *`any`*, relationship: *`any`*): `Promise`<`QuerySnapshot`>

*Defined in [adapters/firestore.ts:39](https://github.com/firebase/emberfire/blob/7728aa3/addon/adapters/firestore.ts#L39)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| _store | `Store` |
| snapshot | `Snapshot`<`never`> |
| _url | `any` |
| relationship | `any` |

**Returns:** `Promise`<`QuerySnapshot`>

___
<a id="findrecord"></a>

###  findRecord

▸ **findRecord**(_store: *`Store`*, type: *`any`*, id: *`string`*): `Promise`<`DocumentSnapshot`>

*Defined in [adapters/firestore.ts:31](https://github.com/firebase/emberfire/blob/7728aa3/addon/adapters/firestore.ts#L31)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| _store | `Store` |
| type | `any` |
| id | `string` |

**Returns:** `Promise`<`DocumentSnapshot`>

___
<a id="query"></a>

###  query

▸ **query**(_store: *`Store`*, type: *`any`*, queryFn: *[QueryFn](../#queryfn)*): `Promise`<`QuerySnapshot`>

*Defined in [adapters/firestore.ts:56](https://github.com/firebase/emberfire/blob/7728aa3/addon/adapters/firestore.ts#L56)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| _store | `Store` |
| type | `any` |
| queryFn | [QueryFn](../#queryfn) |

**Returns:** `Promise`<`QuerySnapshot`>

___
<a id="shouldbackgroundreloadrecord"></a>

###  shouldBackgroundReloadRecord

▸ **shouldBackgroundReloadRecord**(): `boolean`

*Defined in [adapters/firestore.ts:60](https://github.com/firebase/emberfire/blob/7728aa3/addon/adapters/firestore.ts#L60)*

**Returns:** `boolean`

___
<a id="updaterecord"></a>

###  updateRecord

▸ **updateRecord**(_store: *`Store`*, type: *`any`*, snapshot: *`Snapshot`<`never`>*): `Promise`<`void`>

*Defined in [adapters/firestore.ts:64](https://github.com/firebase/emberfire/blob/7728aa3/addon/adapters/firestore.ts#L64)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| _store | `Store` |
| type | `any` |
| snapshot | `Snapshot`<`never`> |

**Returns:** `Promise`<`void`>

___

