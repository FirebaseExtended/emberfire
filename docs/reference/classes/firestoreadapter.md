[EmberFire](../README.md) > [FirestoreAdapter](../classes/firestoreadapter.md)

# Class: FirestoreAdapter

Persist your Ember Data models in Cloud Firestore

```js
// app/adapters/application.js
import FirestoreAdapter from 'emberfire/adapters/firestore';

export default class ApplicationAdapter extends FirestoreAdapter {
  // configuration goes here
}
```

## Hierarchy

`object` & `Adapter`<`this`>

**↳ FirestoreAdapter**

## Index

### Properties

- [enablePersistence](firestoreadapter.md#enablepersistence)
- [firebaseApp](firestoreadapter.md#firebaseapp)
- [namespace](firestoreadapter.md#namespace)
- [persistenceSettings](firestoreadapter.md#persistencesettings)
- [settings](firestoreadapter.md#settings)

### Methods

- [createRecord](firestoreadapter.md#createrecord)
- [deleteRecord](firestoreadapter.md#deleterecord)
- [findAll](firestoreadapter.md#findall)
- [findBelongsTo](firestoreadapter.md#findbelongsto)
- [findHasMany](firestoreadapter.md#findhasmany)
- [findRecord](firestoreadapter.md#findrecord)
- [query](firestoreadapter.md#query)
- [queryRecord](firestoreadapter.md#queryrecord)
- [shouldBackgroundReloadRecord](firestoreadapter.md#shouldbackgroundreloadrecord)
- [updateRecord](firestoreadapter.md#updaterecord)

---

## Properties

<a id="enablepersistence"></a>

### enablePersistence

**● enablePersistence**: _`boolean`_

_Defined in [adapters/firestore.ts:52](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L52)_

Enable offline persistence with Cloud Firestore, it is not enabled by default

```js
// app/adapters/application.js
import FirestoreAdapter from 'emberfire/adapters/firestore';

export default class ApplicationAdapter extends FirestoreAdapter {
  enablePersistence = true;
}
```

---

<a id="firebaseapp"></a>

### firebaseApp

**● firebaseApp**: _`ComputedProperty`<[FirebaseAppService](firebaseappservice.md), [FirebaseAppService](firebaseappservice.md)>_

_Defined in [adapters/firestore.ts:118](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L118)_

Override the default FirebaseApp Service used by the FirestoreAdapter: `service('firebase-app')`

```js
// app/adapters/application.js
import FirestoreAdapter from 'emberfire/adapters/firestore';
import { inject as service } from '@ember/service';

export default class ApplicationAdapter extends FirestoreAdapter {
  @service('firebase-different-app') firebaseApp;
}
```

---

<a id="namespace"></a>

### namespace

**● namespace**: _`string` \| `undefined`_

_Defined in [adapters/firestore.ts:68](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L68)_

Namespace all of the default collections

```js
// app/adapters/application.js
import FirestoreAdapter from 'emberfire/adapters/firestore';

export default class ApplicationAdapter extends FirestoreAdapter {
  namespace = 'environments/production';
}
```

---

<a id="persistencesettings"></a>

### persistenceSettings

**● persistenceSettings**: _`PersistenceSettings`_

_Defined in [adapters/firestore.ts:101](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L101)_

Pass persistence settings to Cloud Firestore, enablePersistence has to be true for these to be used

```js
// app/adapters/application.js
import FirestoreAdapter from 'emberfire/adapters/firestore';

export default class ApplicationAdapter extends FirestoreAdapter {
  enablePersistence = true;
  persistenceSettings = { synchronizeTabs: true };
}
```

---

<a id="settings"></a>

### settings

**● settings**: _`Settings`_

_Defined in [adapters/firestore.ts:84](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L84)_

Override the default configuration of the Cloud Firestore adapter: `{ timestampsInSnapshots: true }`

```js
// app/adapters/application.js
import FirestoreAdapter from 'emberfire/adapters/firestore';

export default class ApplicationAdapter extends FirestoreAdapter {
  settings = { timestampsInSnapshots: true };
}
```

---

## Methods

<a id="createrecord"></a>

### createRecord

▸ **createRecord**<`K`>(\_store: _`Store`_, type: _`ModelRegistry[K]`_, snapshot: _`Snapshot`<`K`>_): `Promise`<`DocumentSnapshot`>

_Defined in [adapters/firestore.ts:181](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L181)_

**Type parameters:**

#### K : `keyof ModelRegistry`

**Parameters:**

| Name     | Type               |
| -------- | ------------------ |
| \_store  | `Store`            |
| type     | `ModelRegistry[K]` |
| snapshot | `Snapshot`<`K`>    |

**Returns:** `Promise`<`DocumentSnapshot`>

---

<a id="deleterecord"></a>

### deleteRecord

▸ **deleteRecord**<`K`>(\_store: _`Store`_, type: _`ModelRegistry[K]`_, snapshot: _`Snapshot`<`K`>_): `Promise`<`void`>

_Defined in [adapters/firestore.ts:192](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L192)_

**Type parameters:**

#### K : `keyof ModelRegistry`

**Parameters:**

| Name     | Type               |
| -------- | ------------------ |
| \_store  | `Store`            |
| type     | `ModelRegistry[K]` |
| snapshot | `Snapshot`<`K`>    |

**Returns:** `Promise`<`void`>

---

<a id="findall"></a>

### findAll

▸ **findAll**<`K`>(store: _`Store`_, type: _`ModelRegistry[K]`_): `Promise`<`QuerySnapshot`>

_Defined in [adapters/firestore.ts:124](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L124)_

**Type parameters:**

#### K : `keyof ModelRegistry`

**Parameters:**

| Name  | Type               |
| ----- | ------------------ |
| store | `Store`            |
| type  | `ModelRegistry[K]` |

**Returns:** `Promise`<`QuerySnapshot`>

---

<a id="findbelongsto"></a>

### findBelongsTo

▸ **findBelongsTo**<`K`>(store: _`Store`_, snapshot: _`Snapshot`<`K`>_, url: _`string`_, relationship: _`object`_): `Promise`<`any`>

_Defined in [adapters/firestore.ts:139](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L139)_

**Type parameters:**

#### K : `keyof ModelRegistry`

**Parameters:**

| Name         | Type            |
| ------------ | --------------- |
| store        | `Store`         |
| snapshot     | `Snapshot`<`K`> |
| url          | `string`        |
| relationship | `object`        |

**Returns:** `Promise`<`any`>

---

<a id="findhasmany"></a>

### findHasMany

▸ **findHasMany**<`K`>(store: _`Store`_, snapshot: _`Snapshot`<`K`>_, url: _`string`_, relationship: _`object`_): `Promise`<`any`>

_Defined in [adapters/firestore.ts:128](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L128)_

**Type parameters:**

#### K : `keyof ModelRegistry`

**Parameters:**

| Name         | Type            |
| ------------ | --------------- |
| store        | `Store`         |
| snapshot     | `Snapshot`<`K`> |
| url          | `string`        |
| relationship | `object`        |

**Returns:** `Promise`<`any`>

---

<a id="findrecord"></a>

### findRecord

▸ **findRecord**<`K`>(\_store: _`Store`_, type: _`ModelRegistry[K]`_, id: _`string`_): `Promise`<`DocumentSnapshot`>

_Defined in [adapters/firestore.ts:120](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L120)_

**Type parameters:**

#### K : `keyof ModelRegistry`

**Parameters:**

| Name    | Type               |
| ------- | ------------------ |
| \_store | `Store`            |
| type    | `ModelRegistry[K]` |
| id      | `string`           |

**Returns:** `Promise`<`DocumentSnapshot`>

---

<a id="query"></a>

### query

▸ **query**<`K`>(\_store: _`Store`_, type: _`ModelRegistry[K]`_, options?: _[QueryOptions](../#queryoptions)_, \_recordArray?: _`DS.AdapterPopulatedRecordArray`<`any`>_): `Promise`<`QuerySnapshot`>

_Defined in [adapters/firestore.ts:148](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L148)_

**Type parameters:**

#### K : `keyof ModelRegistry`

**Parameters:**

| Name                     | Type                                    |
| ------------------------ | --------------------------------------- |
| \_store                  | `Store`                                 |
| type                     | `ModelRegistry[K]`                      |
| `Optional` options       | [QueryOptions](../#queryoptions)        |
| `Optional` \_recordArray | `DS.AdapterPopulatedRecordArray`<`any`> |

**Returns:** `Promise`<`QuerySnapshot`>

---

<a id="queryrecord"></a>

### queryRecord

▸ **queryRecord**<`K`>(\_store: _`Store`_, type: _`ModelRegistry[K]`_, options?: _[QueryOptions](../#queryoptions) \| [QueryRecordOptions](../#queryrecordoptions)_): `Promise`<`DocumentSnapshot`>

_Defined in [adapters/firestore.ts:152](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L152)_

**Type parameters:**

#### K : `keyof ModelRegistry`

**Parameters:**

| Name               | Type                                                                             |
| ------------------ | -------------------------------------------------------------------------------- |
| \_store            | `Store`                                                                          |
| type               | `ModelRegistry[K]`                                                               |
| `Optional` options | [QueryOptions](../#queryoptions) \| [QueryRecordOptions](../#queryrecordoptions) |

**Returns:** `Promise`<`DocumentSnapshot`>

---

<a id="shouldbackgroundreloadrecord"></a>

### shouldBackgroundReloadRecord

▸ **shouldBackgroundReloadRecord**(): `boolean`

_Defined in [adapters/firestore.ts:170](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L170)_

**Returns:** `boolean`

---

<a id="updaterecord"></a>

### updateRecord

▸ **updateRecord**<`K`>(\_store: _`Store`_, type: _`ModelRegistry[K]`_, snapshot: _`Snapshot`<`K`>_): `Promise`<`void`>

_Defined in [adapters/firestore.ts:174](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/firestore.ts#L174)_

**Type parameters:**

#### K : `keyof ModelRegistry`

**Parameters:**

| Name     | Type               |
| -------- | ------------------ |
| \_store  | `Store`            |
| type     | `ModelRegistry[K]` |
| snapshot | `Snapshot`<`K`>    |

**Returns:** `Promise`<`void`>

---
