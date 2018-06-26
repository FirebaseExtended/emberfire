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

*Defined in [adapters/firestore.ts:54](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L54)*

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

*Defined in [adapters/firestore.ts:87](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L87)*

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
<a id="settings"></a>

###  settings

**● settings**: *`Settings`*

*Defined in [adapters/firestore.ts:70](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L70)*

Override the default configuration of the Cloud Firestore adapter: `{ timestampsInSnapshots: true }`

```js
// app/adapters/application.js
import FirestoreAdapter from 'emberfire/adapters/firestore';

export default FirestoreAdapter.extend({
  settings: { timestampsInSnapshots: false }
});
```

___

## Methods

<a id="createrecord"></a>

###  createRecord

▸ **createRecord**(_store: *`Store`*, type: *`any`*, snapshot: *`Snapshot`<`never`>*): `Promise`< `void` &#124; `DocumentReference`>

*Defined in [adapters/firestore.ts:128](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L128)*

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

*Defined in [adapters/firestore.ts:141](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L141)*

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

*Defined in [adapters/firestore.ts:93](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L93)*

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

*Defined in [adapters/firestore.ts:110](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L110)*

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

*Defined in [adapters/firestore.ts:97](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L97)*

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

*Defined in [adapters/firestore.ts:89](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L89)*

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

*Defined in [adapters/firestore.ts:114](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L114)*

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

*Defined in [adapters/firestore.ts:118](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L118)*

**Returns:** `boolean`

___
<a id="updaterecord"></a>

###  updateRecord

▸ **updateRecord**(_store: *`Store`*, type: *`any`*, snapshot: *`Snapshot`<`never`>*): `Promise`<`void`>

*Defined in [adapters/firestore.ts:122](https://github.com/firebase/emberfire/blob/v3/addon/adapters/firestore.ts#L122)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| _store | `Store` |
| type | `any` |
| snapshot | `Snapshot`<`never`> |

**Returns:** `Promise`<`void`>

___

