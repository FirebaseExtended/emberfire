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

*Defined in [services/firebase-app.ts:31](https://github.com/firebase/emberfire/blob/7728aa3/addon/services/firebase-app.ts#L31)*

___
<a id="name"></a>

### `<Optional>` name

**● name**: * `undefined` &#124; `string`
*

*Defined in [services/firebase-app.ts:31](https://github.com/firebase/emberfire/blob/7728aa3/addon/services/firebase-app.ts#L31)*

___
<a id="options"></a>

### `<Optional>` options

**● options**: * `undefined` &#124; `object`
*

*Defined in [services/firebase-app.ts:33](https://github.com/firebase/emberfire/blob/7728aa3/addon/services/firebase-app.ts#L33)*

___

## Methods

<a id="auth"></a>

###  auth

▸ **auth**(): `Auth`

*Defined in [services/firebase-app.ts:34](https://github.com/firebase/emberfire/blob/7728aa3/addon/services/firebase-app.ts#L34)*

**Returns:** `Auth`

___
<a id="database"></a>

###  database

▸ **database**(databaseURL?: * `undefined` &#124; `string`*): `Database`

*Defined in [services/firebase-app.ts:35](https://github.com/firebase/emberfire/blob/7728aa3/addon/services/firebase-app.ts#L35)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` databaseURL |  `undefined` &#124; `string`|

**Returns:** `Database`

___
<a id="firestore"></a>

###  firestore

▸ **firestore**(): `Firestore`

*Defined in [services/firebase-app.ts:36](https://github.com/firebase/emberfire/blob/7728aa3/addon/services/firebase-app.ts#L36)*

**Returns:** `Firestore`

___
<a id="functions"></a>

###  functions

▸ **functions**(): `Functions`

*Defined in [services/firebase-app.ts:37](https://github.com/firebase/emberfire/blob/7728aa3/addon/services/firebase-app.ts#L37)*

**Returns:** `Functions`

___
<a id="init"></a>

###  init

▸ **init**(): `void`

*Defined in [services/firebase-app.ts:41](https://github.com/firebase/emberfire/blob/7728aa3/addon/services/firebase-app.ts#L41)*

**Returns:** `void`

___
<a id="messaging"></a>

###  messaging

▸ **messaging**(): `Messaging`

*Defined in [services/firebase-app.ts:38](https://github.com/firebase/emberfire/blob/7728aa3/addon/services/firebase-app.ts#L38)*

**Returns:** `Messaging`

___
<a id="storage"></a>

###  storage

▸ **storage**(storageBucket?: * `undefined` &#124; `string`*): `Storage`

*Defined in [services/firebase-app.ts:39](https://github.com/firebase/emberfire/blob/7728aa3/addon/services/firebase-app.ts#L39)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` storageBucket |  `undefined` &#124; `string`|

**Returns:** `Storage`

___

