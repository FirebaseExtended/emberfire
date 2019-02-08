[EmberFire](../README.md) > [FirestoreAdapter](../classes/firestoreadapter.md)

# Class: FirestoreAdapter

Persist your Ember Data models in Cloud Firestore

```js
// app/adapters/application.js
import FirestoreAdapter from 'emberfire/adapters/firestore';

export default FirestoreAdapter.extend({
  // configuration goes here
});
```

## Hierarchy

 `object` & `Adapter`<`this`>

**↳ FirestoreAdapter**

## Index

### Properties

* [enablePersistence](firestoreadapter.md#enablepersistence)
* [firebaseApp](firestoreadapter.md#firebaseapp)
* [persistenceSettings](firestoreadapter.md#persistencesettings)
* [settings](firestoreadapter.md#settings)

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

<a id="enablepersistence"></a>

###  enablePersistence

**● enablePersistence**: *`boolean`*

*Defined in [adapters/firestore.ts:55](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L55)*

Enable offline persistence with Cloud Firestore, it is not enabled by default

```js
// app/adapters/application.js
import FirestoreAdapter from 'emberfire/adapters/firestore';

export default FirestoreAdapter.extend({
  enablePersistence: true
});
```

___
<a id="firebaseapp"></a>

###  firebaseApp

**● firebaseApp**: *`ComputedProperty`<[FirebaseAppService](firebaseappservice.md), [FirebaseAppService](firebaseappservice.md)>*

*Defined in [adapters/firestore.ts:105](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L105)*

Override the default FirebaseApp Service used by the FirestoreAdapter: `service('firebase-app')`

```js
// app/adapters/application.js
import FirestoreAdapter from 'emberfire/adapters/firestore';
import { inject as service } from '@ember/service';

export default FirestoreAdapter.extend({
  firebaseApp: service('firebase-different-app')
});
```

___
<a id="persistencesettings"></a>

###  persistenceSettings

**● persistenceSettings**: *`PersistenceSettings`*

*Defined in [adapters/firestore.ts:88](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L88)*

Pass persistence settings to Cloud Firestore, enablePersistence has to be true for these to be used

```js
// app/adapters/application.js
import FirestoreAdapter from 'emberfire/adapters/firestore';

export default FirestoreAdapter.extend({
  enablePersistence: true,
  persistenceSettings: { experimentalTabSynchronization: true }
});
```

___
<a id="settings"></a>

###  settings

**● settings**: *`Settings`*

*Defined in [adapters/firestore.ts:71](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L71)*

Override the default configuration of the Cloud Firestore adapter: `{ timestampsInSnapshots: true }`

```js
// app/adapters/application.js
import FirestoreAdapter from 'emberfire/adapters/firestore';

export default FirestoreAdapter.extend({
  settings: { timestampsInSnapshots: true }
});
```

___

## Methods

<a id="createrecord"></a>

###  createRecord

▸ **createRecord**<`K`>(_store: *`Store`*, type: *`ModelRegistry[K]`*, snapshot: *`Snapshot`<`K`>*): `Promise`<`DocumentSnapshot`>

*Defined in [adapters/firestore.ts:149](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L149)*

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| _store | `Store` |
| type | `ModelRegistry[K]` |
| snapshot | `Snapshot`<`K`> |

**Returns:** `Promise`<`DocumentSnapshot`>

___
<a id="deleterecord"></a>

###  deleteRecord

▸ **deleteRecord**<`K`>(_store: *`Store`*, type: *`ModelRegistry[K]`*, snapshot: *`Snapshot`<`K`>*): `Promise`<`void`>

*Defined in [adapters/firestore.ts:160](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L160)*

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| _store | `Store` |
| type | `ModelRegistry[K]` |
| snapshot | `Snapshot`<`K`> |

**Returns:** `Promise`<`void`>

___
<a id="findall"></a>

###  findAll

▸ **findAll**<`K`>(_store: *`Store`*, type: *`ModelRegistry[K]`*): `Promise`<`QuerySnapshot`>

*Defined in [adapters/firestore.ts:111](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L111)*

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| _store | `Store` |
| type | `ModelRegistry[K]` |

**Returns:** `Promise`<`QuerySnapshot`>

___
<a id="findbelongsto"></a>

###  findBelongsTo

▸ **findBelongsTo**<`K`>(store: *`Store`*, snapshot: *`Snapshot`<`K`>*, url: *`string`*, relationship: *`object`*): `any`

*Defined in [adapters/firestore.ts:126](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L126)*

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
<a id="findhasmany"></a>

###  findHasMany

▸ **findHasMany**<`K`>(store: *`Store`*, snapshot: *`Snapshot`<`K`>*, url: *`string`*, relationship: *`object`*): `any`

*Defined in [adapters/firestore.ts:115](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L115)*

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

▸ **findRecord**<`K`>(_store: *`Store`*, type: *`ModelRegistry[K]`*, id: *`string`*): `Promise`<`DocumentSnapshot`>

*Defined in [adapters/firestore.ts:107](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L107)*

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| _store | `Store` |
| type | `ModelRegistry[K]` |
| id | `string` |

**Returns:** `Promise`<`DocumentSnapshot`>

___
<a id="query"></a>

###  query

▸ **query**<`K`>(_store: *`Store`*, type: *`ModelRegistry[K]`*, queryFn: *[QueryFn](../#queryfn)*, _recordArray: *`AdapterPopulatedRecordArray`<`any`>*): `Promise`<`QuerySnapshot`>

*Defined in [adapters/firestore.ts:135](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L135)*

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| _store | `Store` |
| type | `ModelRegistry[K]` |
| queryFn | [QueryFn](../#queryfn) |
| _recordArray | `AdapterPopulatedRecordArray`<`any`> |

**Returns:** `Promise`<`QuerySnapshot`>

___
<a id="shouldbackgroundreloadrecord"></a>

###  shouldBackgroundReloadRecord

▸ **shouldBackgroundReloadRecord**(): `boolean`

*Defined in [adapters/firestore.ts:139](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L139)*

**Returns:** `boolean`

___
<a id="updaterecord"></a>

###  updateRecord

▸ **updateRecord**<`K`>(_store: *`Store`*, type: *`ModelRegistry[K]`*, snapshot: *`Snapshot`<`K`>*): `Promise`<`void`>

*Defined in [adapters/firestore.ts:143](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L143)*

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| _store | `Store` |
| type | `ModelRegistry[K]` |
| snapshot | `Snapshot`<`K`> |

**Returns:** `Promise`<`void`>

___

