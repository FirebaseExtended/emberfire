[EmberFire](../README.md) > [FirebaseAppService](../classes/firebaseappservice.md)

# Class: FirebaseAppService

## Hierarchy

 `object` & `Service`<`this`>

**↳ FirebaseAppService**

## Index

### Properties

* [firebase](firebaseappservice.md#firebase)
* [name](firebaseappservice.md#name)
* [options](firebaseappservice.md#options)

### Methods

* [auth](firebaseappservice.md#auth)
* [database](firebaseappservice.md#database)
* [delete](firebaseappservice.md#delete)
* [firestore](firebaseappservice.md#firestore)
* [functions](firebaseappservice.md#functions)
* [init](firebaseappservice.md#init)
* [messaging](firebaseappservice.md#messaging)
* [storage](firebaseappservice.md#storage)

---

## Properties

<a id="firebase"></a>

###  firebase

**● firebase**: *`ComputedProperty`<[FirebaseService](firebaseservice.md), [FirebaseService](firebaseservice.md)>*

*Defined in [services/firebase-app.ts:35](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/services/firebase-app.ts#L35)*

___
<a id="name"></a>

### `<Optional>` name

**● name**: *`undefined` \| `string`*

*Defined in [services/firebase-app.ts:35](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/services/firebase-app.ts#L35)*

___
<a id="options"></a>

### `<Optional>` options

**● options**: *`undefined` \| `object`*

*Defined in [services/firebase-app.ts:37](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/services/firebase-app.ts#L37)*

___

## Methods

<a id="auth"></a>

###  auth

▸ **auth**(): `Promise`<`Auth`>

*Defined in [services/firebase-app.ts:40](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/services/firebase-app.ts#L40)*

**Returns:** `Promise`<`Auth`>

___
<a id="database"></a>

###  database

▸ **database**(databaseURL?: *`undefined` \| `string`*): `Promise`<`Database`>

*Defined in [services/firebase-app.ts:41](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/services/firebase-app.ts#L41)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` databaseURL | `undefined` \| `string` |

**Returns:** `Promise`<`Database`>

___
<a id="delete"></a>

###  delete

▸ **delete**(): `Promise`<`any`>

*Defined in [services/firebase-app.ts:39](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/services/firebase-app.ts#L39)*

**Returns:** `Promise`<`any`>

___
<a id="firestore"></a>

###  firestore

▸ **firestore**(): `Promise`<`Firestore`>

*Defined in [services/firebase-app.ts:42](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/services/firebase-app.ts#L42)*

**Returns:** `Promise`<`Firestore`>

___
<a id="functions"></a>

###  functions

▸ **functions**(region?: *`undefined` \| `string`*): `Promise`<`Functions`>

*Defined in [services/firebase-app.ts:43](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/services/firebase-app.ts#L43)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` region | `undefined` \| `string` |

**Returns:** `Promise`<`Functions`>

___
<a id="init"></a>

###  init

▸ **init**(): `void`

*Defined in [services/firebase-app.ts:47](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/services/firebase-app.ts#L47)*

**Returns:** `void`

___
<a id="messaging"></a>

###  messaging

▸ **messaging**(): `Promise`<`Messaging`>

*Defined in [services/firebase-app.ts:44](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/services/firebase-app.ts#L44)*

**Returns:** `Promise`<`Messaging`>

___
<a id="storage"></a>

###  storage

▸ **storage**(storageBucket?: *`undefined` \| `string`*): `Promise`<`Storage`>

*Defined in [services/firebase-app.ts:45](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/services/firebase-app.ts#L45)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` storageBucket | `undefined` \| `string` |

**Returns:** `Promise`<`Storage`>

___

