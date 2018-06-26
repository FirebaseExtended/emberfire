[EmberFire](../README.md) > [RealtimeDatabaseAdapter](../classes/realtimedatabaseadapter.md)

# Class: RealtimeDatabaseAdapter

## Hierarchy

  `object` & `Adapter`<`this`>

**↳ RealtimeDatabaseAdapter**

## Index

### Properties

* [database](realtimedatabaseadapter.md#database)
* [databaseURL](realtimedatabaseadapter.md#databaseurl)
* [defaultSerializer](realtimedatabaseadapter.md#defaultserializer)
* [firebaseApp](realtimedatabaseadapter.md#firebaseapp)

### Methods

* [createRecord](realtimedatabaseadapter.md#createrecord)
* [deleteRecord](realtimedatabaseadapter.md#deleterecord)
* [findAll](realtimedatabaseadapter.md#findall)
* [findBelongsTo](realtimedatabaseadapter.md#findbelongsto)
* [findHasMany](realtimedatabaseadapter.md#findhasmany)
* [findRecord](realtimedatabaseadapter.md#findrecord)
* [query](realtimedatabaseadapter.md#query)
* [queryRecord](realtimedatabaseadapter.md#queryrecord)
* [shouldBackgroundReloadRecord](realtimedatabaseadapter.md#shouldbackgroundreloadrecord)
* [updateRecord](realtimedatabaseadapter.md#updaterecord)

---

## Properties

<a id="database"></a>

### `<Optional>` database

**● database**: *`database.Database`*

*Defined in [adapters/realtime-database.ts:26](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L26)*

___
<a id="databaseurl"></a>

### `<Optional>` databaseURL

**● databaseURL**: * `undefined` &#124; `string`
*

*Defined in [adapters/realtime-database.ts:24](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L24)*

___
<a id="defaultserializer"></a>

###  defaultSerializer

**● defaultSerializer**: *`string`* = "-realtime-database"

*Defined in [adapters/realtime-database.ts:27](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L27)*

___
<a id="firebaseapp"></a>

###  firebaseApp

**● firebaseApp**: *`ComputedProperty`<[FirebaseAppService](firebaseappservice.md), [FirebaseAppService](firebaseappservice.md)>*

*Defined in [adapters/realtime-database.ts:24](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L24)*

___

## Methods

<a id="createrecord"></a>

###  createRecord

▸ **createRecord**(_: *`Store`*, type: *`any`*, snapshot: *`Snapshot`<`never`>*): `Promise`<`any`>

*Defined in [adapters/realtime-database.ts:78](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L78)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| _ | `Store` |
| type | `any` |
| snapshot | `Snapshot`<`never`> |

**Returns:** `Promise`<`any`>

___
<a id="deleterecord"></a>

###  deleteRecord

▸ **deleteRecord**(_: *`Store`*, type: *`any`*, snapshot: *`Snapshot`<`never`>*): `Promise`<`any`>

*Defined in [adapters/realtime-database.ts:90](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L90)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| _ | `Store` |
| type | `any` |
| snapshot | `Snapshot`<`never`> |

**Returns:** `Promise`<`any`>

___
<a id="findall"></a>

###  findAll

▸ **findAll**(_store: *`Store`*, type: *`any`*): `Promise`<`DataSnapshot`>

*Defined in [adapters/realtime-database.ts:33](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L33)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| _store | `Store` |
| type | `any` |

**Returns:** `Promise`<`DataSnapshot`>

___
<a id="findbelongsto"></a>

###  findBelongsTo

▸ **findBelongsTo**(_store: *`Store`*, snapshot: *`Snapshot`<`never`>*, _url: *`any`*, relationship: *`any`*): `Promise`<`DataSnapshot`>

*Defined in [adapters/realtime-database.ts:47](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L47)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| _store | `Store` |
| snapshot | `Snapshot`<`never`> |
| _url | `any` |
| relationship | `any` |

**Returns:** `Promise`<`DataSnapshot`>

___
<a id="findhasmany"></a>

###  findHasMany

▸ **findHasMany**(_store: *`Store`*, snapshot: *`any`*, _url: *`string`*, relationship: *`any`*): `Promise`<`DataSnapshot`>

*Defined in [adapters/realtime-database.ts:37](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L37)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| _store | `Store` |
| snapshot | `any` |
| _url | `string` |
| relationship | `any` |

**Returns:** `Promise`<`DataSnapshot`>

___
<a id="findrecord"></a>

###  findRecord

▸ **findRecord**(_store: *`Store`*, type: *`any`*, id: *`string`*): `Promise`<`DataSnapshot`>

*Defined in [adapters/realtime-database.ts:29](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L29)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| _store | `Store` |
| type | `any` |
| id | `string` |

**Returns:** `Promise`<`DataSnapshot`>

___
<a id="query"></a>

###  query

▸ **query**(_store: *`Store`*, type: *`any`*, queryFn: *[QueryFn](../#queryfn)*): `Promise`<`DataSnapshot`>

*Defined in [adapters/realtime-database.ts:51](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L51)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| _store | `Store` |
| type | `any` |
| queryFn | [QueryFn](../#queryfn) |

**Returns:** `Promise`<`DataSnapshot`>

___
<a id="queryrecord"></a>

###  queryRecord

▸ **queryRecord**(_store: *`Store`*, type: *`any`*, queryFn: *[QueryFn](../#queryfn)*): `Promise`<`DataSnapshot`>

*Defined in [adapters/realtime-database.ts:55](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L55)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| _store | `Store` |
| type | `any` |
| queryFn | [QueryFn](../#queryfn) |

**Returns:** `Promise`<`DataSnapshot`>

___
<a id="shouldbackgroundreloadrecord"></a>

###  shouldBackgroundReloadRecord

▸ **shouldBackgroundReloadRecord**(): `boolean`

*Defined in [adapters/realtime-database.ts:68](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L68)*

**Returns:** `boolean`

___
<a id="updaterecord"></a>

###  updateRecord

▸ **updateRecord**(_: *`Store`*, type: *`any`*, snapshot: *`Snapshot`<`never`>*): `Promise`<`any`>

*Defined in [adapters/realtime-database.ts:72](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L72)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| _ | `Store` |
| type | `any` |
| snapshot | `Snapshot`<`never`> |

**Returns:** `Promise`<`any`>

___

