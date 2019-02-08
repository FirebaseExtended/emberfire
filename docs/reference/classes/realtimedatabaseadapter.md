[EmberFire](../README.md) > [RealtimeDatabaseAdapter](../classes/realtimedatabaseadapter.md)

# Class: RealtimeDatabaseAdapter

Persist your Ember Data models in the Firebase Realtime Database

```js
// app/adapters/application.js
import RealtimeDatabaseAdapter from 'emberfire/adapters/realtime-database';

export default RealtimeDatabaseAdapter.extend({
  // configuration goes here
});
```

## Hierarchy

 `object` & `Adapter`<`this`>

**↳ RealtimeDatabaseAdapter**

## Index

### Properties

* [databaseURL](realtimedatabaseadapter.md#databaseurl)
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

<a id="databaseurl"></a>

### `<Optional>` databaseURL

**● databaseURL**: *`undefined` \| `string`*

*Defined in [adapters/realtime-database.ts:69](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L69)*

Override the default database used by the RealtimeDatabaseAdapter

```js
// app/adapters/application.js
import RealtimeDatabaseAdapter from 'emberfire/adapters/realtime-database';

export default RealtimeDatabaseAdapter.extend({
  databaseURL: 'https://DIFFERENT_DATABASE.firebaseio.com'
});
```

___
<a id="firebaseapp"></a>

###  firebaseApp

**● firebaseApp**: *`ComputedProperty`<[FirebaseAppService](firebaseappservice.md), [FirebaseAppService](firebaseappservice.md)>*

*Defined in [adapters/realtime-database.ts:53](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L53)*

Override the default FirebaseApp Service used by the RealtimeDatabaseAdapter: `service('firebase-app')`

```js
// app/adapters/application.js
import RealtimeDatabaseAdapter from 'emberfire/adapters/realtime-database';
import { inject as service } from '@ember/service';

export default RealtimeDatabaseAdapter.extend({
  firebaseApp: service('firebase-different-app')
});
```

___

## Methods

<a id="createrecord"></a>

###  createRecord

▸ **createRecord**<`K`>(_: *`Store`*, type: *`ModelRegistry[K]`*, snapshot: *`Snapshot`<`K`>*): `Promise`<`DataSnapshot`>

*Defined in [adapters/realtime-database.ts:129](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L129)*

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| _ | `Store` |
| type | `ModelRegistry[K]` |
| snapshot | `Snapshot`<`K`> |

**Returns:** `Promise`<`DataSnapshot`>

___
<a id="deleterecord"></a>

###  deleteRecord

▸ **deleteRecord**<`K`>(_: *`Store`*, type: *`ModelRegistry[K]`*, snapshot: *`Snapshot`<`K`>*): `Promise`<`any`>

*Defined in [adapters/realtime-database.ts:140](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L140)*

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| _ | `Store` |
| type | `ModelRegistry[K]` |
| snapshot | `Snapshot`<`K`> |

**Returns:** `Promise`<`any`>

___
<a id="findall"></a>

###  findAll

▸ **findAll**<`K`>(_store: *`Store`*, type: *`ModelRegistry[K]`*): `Promise`<`DataSnapshot`>

*Defined in [adapters/realtime-database.ts:75](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L75)*

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| _store | `Store` |
| type | `ModelRegistry[K]` |

**Returns:** `Promise`<`DataSnapshot`>

___
<a id="findbelongsto"></a>

###  findBelongsTo

▸ **findBelongsTo**<`K`>(store: *`Store`*, snapshot: *`Snapshot`<`K`>*, url: *`any`*, relationship: *`any`*): `any`

*Defined in [adapters/realtime-database.ts:93](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L93)*

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| snapshot | `Snapshot`<`K`> |
| url | `any` |
| relationship | `any` |

**Returns:** `any`

___
<a id="findhasmany"></a>

###  findHasMany

▸ **findHasMany**<`K`>(store: *`Store`*, snapshot: *`Snapshot`<`K`>*, url: *`string`*, relationship: *`object`*): `any`

*Defined in [adapters/realtime-database.ts:79](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L79)*

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| snapshot | `Snapshot`<`K`> |
| url | `string` |
| relationship | `object` |

**Returns:** `any`

___
<a id="findrecord"></a>

###  findRecord

▸ **findRecord**<`K`>(_store: *`Store`*, type: *`ModelRegistry[K]`*, id: *`string`*): `Promise`<`DataSnapshot`>

*Defined in [adapters/realtime-database.ts:71](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L71)*

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| _store | `Store` |
| type | `ModelRegistry[K]` |
| id | `string` |

**Returns:** `Promise`<`DataSnapshot`>

___
<a id="query"></a>

###  query

▸ **query**<`K`>(_store: *`Store`*, type: *`ModelRegistry[K]`*, queryFn: *[QueryFn](../#queryfn)*): `Promise`<`DataSnapshot`>

*Defined in [adapters/realtime-database.ts:102](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L102)*

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| _store | `Store` |
| type | `ModelRegistry[K]` |
| queryFn | [QueryFn](../#queryfn) |

**Returns:** `Promise`<`DataSnapshot`>

___
<a id="queryrecord"></a>

###  queryRecord

▸ **queryRecord**<`K`>(_store: *`Store`*, type: *`ModelRegistry[K]`*, queryFn: *[QueryFn](../#queryfn)*): `Promise`<`DataSnapshot`>

*Defined in [adapters/realtime-database.ts:106](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L106)*

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| _store | `Store` |
| type | `ModelRegistry[K]` |
| queryFn | [QueryFn](../#queryfn) |

**Returns:** `Promise`<`DataSnapshot`>

___
<a id="shouldbackgroundreloadrecord"></a>

###  shouldBackgroundReloadRecord

▸ **shouldBackgroundReloadRecord**(): `boolean`

*Defined in [adapters/realtime-database.ts:119](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L119)*

**Returns:** `boolean`

___
<a id="updaterecord"></a>

###  updateRecord

▸ **updateRecord**<`K`>(_: *`Store`*, type: *`ModelRegistry[K]`*, snapshot: *`Snapshot`<`K`>*): `Promise`<`any`>

*Defined in [adapters/realtime-database.ts:123](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L123)*

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| _ | `Store` |
| type | `ModelRegistry[K]` |
| snapshot | `Snapshot`<`K`> |

**Returns:** `Promise`<`any`>

___

