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

**● databaseURL**: * `undefined` &#124; `string`
*

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

▸ **createRecord**(_: *`Store`*, type: *`any`*, snapshot: *`Snapshot`<`never`>*): `Promise`<`any`>

*Defined in [adapters/realtime-database.ts:120](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L120)*

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

*Defined in [adapters/realtime-database.ts:132](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L132)*

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

*Defined in [adapters/realtime-database.ts:75](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L75)*

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

*Defined in [adapters/realtime-database.ts:89](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L89)*

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

*Defined in [adapters/realtime-database.ts:79](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L79)*

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

*Defined in [adapters/realtime-database.ts:71](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L71)*

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

*Defined in [adapters/realtime-database.ts:93](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L93)*

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

*Defined in [adapters/realtime-database.ts:97](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L97)*

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

*Defined in [adapters/realtime-database.ts:110](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L110)*

**Returns:** `boolean`

___
<a id="updaterecord"></a>

###  updateRecord

▸ **updateRecord**(_: *`Store`*, type: *`any`*, snapshot: *`Snapshot`<`never`>*): `Promise`<`any`>

*Defined in [adapters/realtime-database.ts:114](https://github.com/firebase/emberfire/blob/v3/addon/adapters/realtime-database.ts#L114)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| _ | `Store` |
| type | `any` |
| snapshot | `Snapshot`<`never`> |

**Returns:** `Promise`<`any`>

___

