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
* [namespace](firestoreadapter.md#namespace)
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
* [queryRecord](firestoreadapter.md#queryrecord)
* [shouldBackgroundReloadRecord](firestoreadapter.md#shouldbackgroundreloadrecord)
* [updateRecord](firestoreadapter.md#updaterecord)

---

## Properties

<a id="enablepersistence"></a>

###  enablePersistence

**● enablePersistence**: *`boolean`*

*Defined in [adapters/firestore.ts:52](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L52)*

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

*Defined in [adapters/firestore.ts:118](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L118)*

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
<a id="namespace"></a>

###  namespace

**● namespace**: *`string` \| `undefined`*

*Defined in [adapters/firestore.ts:68](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L68)*

Namespace all of the default collections

```js
// app/adapters/application.js
import FirestoreAdapter from 'emberfire/adapters/firestore';

export default FirestoreAdapter.extend({
  namespace: 'environments/production'
});
```

___
<a id="persistencesettings"></a>

###  persistenceSettings

**● persistenceSettings**: *`PersistenceSettings`*

*Defined in [adapters/firestore.ts:101](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L101)*

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

*Defined in [adapters/firestore.ts:84](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L84)*

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

*Defined in [adapters/firestore.ts:181](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L181)*

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

*Defined in [adapters/firestore.ts:192](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L192)*

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

▸ **findAll**<`K`>(store: *`Store`*, type: *`ModelRegistry[K]`*): `Promise`<`QuerySnapshot`>

*Defined in [adapters/firestore.ts:124](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L124)*

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| type | `ModelRegistry[K]` |

**Returns:** `Promise`<`QuerySnapshot`>

___
<a id="findbelongsto"></a>

###  findBelongsTo

▸ **findBelongsTo**<`K`>(store: *`Store`*, snapshot: *`Snapshot`<`K`>*, url: *`string`*, relationship: *`object`*): `Promise`<`any`>

*Defined in [adapters/firestore.ts:139](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L139)*

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| snapshot | `Snapshot`<`K`> |
| url | `string` |
| relationship | `object` |

**Returns:** `Promise`<`any`>

___
<a id="findhasmany"></a>

###  findHasMany

▸ **findHasMany**<`K`>(store: *`Store`*, snapshot: *`Snapshot`<`K`>*, url: *`string`*, relationship: *`object`*): `Promise`<`any`>

*Defined in [adapters/firestore.ts:128](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L128)*

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| snapshot | `Snapshot`<`K`> |
| url | `string` |
| relationship | `object` |

**Returns:** `Promise`<`any`>

___
<a id="findrecord"></a>

###  findRecord

▸ **findRecord**<`K`>(_store: *`Store`*, type: *`ModelRegistry[K]`*, id: *`string`*): `Promise`<`DocumentSnapshot`>

*Defined in [adapters/firestore.ts:120](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L120)*

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

▸ **query**<`K`>(_store: *`Store`*, type: *`ModelRegistry[K]`*, options?: *[QueryOptions](../#queryoptions)*, _recordArray?: *`DS.AdapterPopulatedRecordArray`<`any`>*): `Promise`<`QuerySnapshot`>

*Defined in [adapters/firestore.ts:148](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L148)*

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| _store | `Store` |
| type | `ModelRegistry[K]` |
| `Optional` options | [QueryOptions](../#queryoptions) |
| `Optional` _recordArray | `DS.AdapterPopulatedRecordArray`<`any`> |

**Returns:** `Promise`<`QuerySnapshot`>

___
<a id="queryrecord"></a>

###  queryRecord

▸ **queryRecord**<`K`>(_store: *`Store`*, type: *`ModelRegistry[K]`*, options?: *[QueryOptions](../#queryoptions) \| [QueryRecordOptions](../#queryrecordoptions)*): `Promise`<`DocumentSnapshot`>

*Defined in [adapters/firestore.ts:152](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L152)*

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| _store | `Store` |
| type | `ModelRegistry[K]` |
| `Optional` options | [QueryOptions](../#queryoptions) \| [QueryRecordOptions](../#queryrecordoptions) |

**Returns:** `Promise`<`DocumentSnapshot`>

___
<a id="shouldbackgroundreloadrecord"></a>

###  shouldBackgroundReloadRecord

▸ **shouldBackgroundReloadRecord**(): `boolean`

*Defined in [adapters/firestore.ts:170](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L170)*

**Returns:** `boolean`

___
<a id="updaterecord"></a>

###  updateRecord

▸ **updateRecord**<`K`>(_store: *`Store`*, type: *`ModelRegistry[K]`*, snapshot: *`Snapshot`<`K`>*): `Promise`<`void`>

*Defined in [adapters/firestore.ts:174](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L174)*

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

