[EmberFire](../README.md) > [RealtimeDatabaseAdapter](../classes/realtimedatabaseadapter.md)

# Class: RealtimeDatabaseAdapter

Persist your Ember Data models in the Firebase Realtime Database

```js
// app/adapters/application.js
import RealtimeDatabaseAdapter from 'emberfire/adapters/realtime-database';

export default class ApplicationAdapter extends RealtimeDatabaseAdapter {
  // configuration goes here
}
```

## Hierarchy

`object` & `Adapter`<`this`>

**↳ RealtimeDatabaseAdapter**

## Index

### Properties

- [databaseURL](realtimedatabaseadapter.md#databaseurl)
- [firebaseApp](realtimedatabaseadapter.md#firebaseapp)
- [namespace](realtimedatabaseadapter.md#namespace)

### Methods

- [createRecord](realtimedatabaseadapter.md#createrecord)
- [deleteRecord](realtimedatabaseadapter.md#deleterecord)
- [findAll](realtimedatabaseadapter.md#findall)
- [findBelongsTo](realtimedatabaseadapter.md#findbelongsto)
- [findHasMany](realtimedatabaseadapter.md#findhasmany)
- [findRecord](realtimedatabaseadapter.md#findrecord)
- [query](realtimedatabaseadapter.md#query)
- [queryRecord](realtimedatabaseadapter.md#queryrecord)
- [shouldBackgroundReloadRecord](realtimedatabaseadapter.md#shouldbackgroundreloadrecord)
- [updateRecord](realtimedatabaseadapter.md#updaterecord)

---

## Properties

<a id="databaseurl"></a>

### `<Optional>` databaseURL

**● databaseURL**: _`undefined` \| `string`_

_Defined in [adapters/realtime-database.ts:83](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/realtime-database.ts#L83)_

Override the default database used by the RealtimeDatabaseAdapter

```js
// app/adapters/application.js
import RealtimeDatabaseAdapter from 'emberfire/adapters/realtime-database';

export default ApplicationAdapter extends RealtimeDatabaseAdapter{
  databaseURL = 'https://DIFFERENT_DATABASE.firebaseio.com';
};
```

---

<a id="firebaseapp"></a>

### firebaseApp

**● firebaseApp**: _`ComputedProperty`<[FirebaseAppService](firebaseappservice.md), [FirebaseAppService](firebaseappservice.md)>_

_Defined in [adapters/realtime-database.ts:50](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/realtime-database.ts#L50)_

Override the default FirebaseApp Service used by the RealtimeDatabaseAdapter: `service('firebase-app')`

```js
// app/adapters/application.js
import RealtimeDatabaseAdapter from 'emberfire/adapters/realtime-database';
import { inject as service } from '@ember/service';

export default class ApplicationAdapter extends RealtimeDatabaseAdapter {
  @service('firebase-different-app') firebaseApp;
}
```

---

<a id="namespace"></a>

### namespace

**● namespace**: _`string` \| `undefined`_

_Defined in [adapters/realtime-database.ts:67](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/realtime-database.ts#L67)_

Namespace all of the paths

```js
// app/adapters/application.js
import RealtimeDatabaseAdapter from 'emberfire/adapters/realtime-database';

export default class ApplicationAdapter extends RealtimeDatabaseAdapter {
  namespace = 'environments/production';
}
```

---

## Methods

<a id="createrecord"></a>

### createRecord

▸ **createRecord**<`K`>(\_: _`Store`_, type: _`ModelRegistry[K]`_, snapshot: _`Snapshot`<`K`>_): `Promise`<`DataSnapshot`>

_Defined in [adapters/realtime-database.ts:144](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/realtime-database.ts#L144)_

**Type parameters:**

#### K : `keyof ModelRegistry`

**Parameters:**

| Name     | Type               |
| -------- | ------------------ |
| \_       | `Store`            |
| type     | `ModelRegistry[K]` |
| snapshot | `Snapshot`<`K`>    |

**Returns:** `Promise`<`DataSnapshot`>

---

<a id="deleterecord"></a>

### deleteRecord

▸ **deleteRecord**<`K`>(\_: _`Store`_, type: _`ModelRegistry[K]`_, snapshot: _`Snapshot`<`K`>_): `Promise`<`any`>

_Defined in [adapters/realtime-database.ts:155](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/realtime-database.ts#L155)_

**Type parameters:**

#### K : `keyof ModelRegistry`

**Parameters:**

| Name     | Type               |
| -------- | ------------------ |
| \_       | `Store`            |
| type     | `ModelRegistry[K]` |
| snapshot | `Snapshot`<`K`>    |

**Returns:** `Promise`<`any`>

---

<a id="findall"></a>

### findAll

▸ **findAll**<`K`>(store: _`Store`_, type: _`ModelRegistry[K]`_): `Promise`<`DataSnapshot`>

_Defined in [adapters/realtime-database.ts:89](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/realtime-database.ts#L89)_

**Type parameters:**

#### K : `keyof ModelRegistry`

**Parameters:**

| Name  | Type               |
| ----- | ------------------ |
| store | `Store`            |
| type  | `ModelRegistry[K]` |

**Returns:** `Promise`<`DataSnapshot`>

---

<a id="findbelongsto"></a>

### findBelongsTo

▸ **findBelongsTo**<`K`>(store: _`Store`_, snapshot: _`Snapshot`<`K`>_, url: _`any`_, relationship: _`any`_): `Promise`<`any`>

_Defined in [adapters/realtime-database.ts:107](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/realtime-database.ts#L107)_

**Type parameters:**

#### K : `keyof ModelRegistry`

**Parameters:**

| Name         | Type            |
| ------------ | --------------- |
| store        | `Store`         |
| snapshot     | `Snapshot`<`K`> |
| url          | `any`           |
| relationship | `any`           |

**Returns:** `Promise`<`any`>

---

<a id="findhasmany"></a>

### findHasMany

▸ **findHasMany**<`K`>(store: _`Store`_, snapshot: _`Snapshot`<`K`>_, url: _`string`_, relationship: _`object`_): `Promise`<`any`>

_Defined in [adapters/realtime-database.ts:93](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/realtime-database.ts#L93)_

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

▸ **findRecord**<`K`>(\_store: _`Store`_, type: _`ModelRegistry[K]`_, id: _`string`_): `Promise`<`DataSnapshot`>

_Defined in [adapters/realtime-database.ts:85](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/realtime-database.ts#L85)_

**Type parameters:**

#### K : `keyof ModelRegistry`

**Parameters:**

| Name    | Type               |
| ------- | ------------------ |
| \_store | `Store`            |
| type    | `ModelRegistry[K]` |
| id      | `string`           |

**Returns:** `Promise`<`DataSnapshot`>

---

<a id="query"></a>

### query

▸ **query**<`K`>(\_store: _`Store`_, type: _`ModelRegistry[K]`_, options?: _[QueryOptions](../#queryoptions)_): `Promise`<`DataSnapshot`>

_Defined in [adapters/realtime-database.ts:116](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/realtime-database.ts#L116)_

**Type parameters:**

#### K : `keyof ModelRegistry`

**Parameters:**

| Name               | Type                             |
| ------------------ | -------------------------------- |
| \_store            | `Store`                          |
| type               | `ModelRegistry[K]`               |
| `Optional` options | [QueryOptions](../#queryoptions) |

**Returns:** `Promise`<`DataSnapshot`>

---

<a id="queryrecord"></a>

### queryRecord

▸ **queryRecord**<`K`>(\_store: _`Store`_, type: _`ModelRegistry[K]`_, options?: _[QueryOptions](../#queryoptions)_): `Promise`<`DataSnapshot`>

_Defined in [adapters/realtime-database.ts:120](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/realtime-database.ts#L120)_

**Type parameters:**

#### K : `keyof ModelRegistry`

**Parameters:**

| Name               | Type                             |
| ------------------ | -------------------------------- |
| \_store            | `Store`                          |
| type               | `ModelRegistry[K]`               |
| `Optional` options | [QueryOptions](../#queryoptions) |

**Returns:** `Promise`<`DataSnapshot`>

---

<a id="shouldbackgroundreloadrecord"></a>

### shouldBackgroundReloadRecord

▸ **shouldBackgroundReloadRecord**(): `boolean`

_Defined in [adapters/realtime-database.ts:133](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/realtime-database.ts#L133)_

**Returns:** `boolean`

---

<a id="updaterecord"></a>

### updateRecord

▸ **updateRecord**<`K`>(\_: _`Store`_, type: _`ModelRegistry[K]`_, snapshot: _`Snapshot`<`K`>_): `Promise`<`any`>

_Defined in [adapters/realtime-database.ts:137](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/adapters/realtime-database.ts#L137)_

**Type parameters:**

#### K : `keyof ModelRegistry`

**Parameters:**

| Name     | Type               |
| -------- | ------------------ |
| \_       | `Store`            |
| type     | `ModelRegistry[K]` |
| snapshot | `Snapshot`<`K`>    |

**Returns:** `Promise`<`any`>

---
