[EmberFire](../README.md) > [FirebaseAuthenticator](../classes/firebaseauthenticator.md)

# Class: FirebaseAuthenticator

## Hierarchy

 `Evented`<`this`> & `object` & `EmberObject`<`this`>

**↳ FirebaseAuthenticator**

## Index

### Properties

* [firebaseApp](firebaseauthenticator.md#firebaseapp)

### Methods

* [authenticate](firebaseauthenticator.md#authenticate)
* [invalidate](firebaseauthenticator.md#invalidate)
* [restore](firebaseauthenticator.md#restore)

---

## Properties

<a id="firebaseapp"></a>

###  firebaseApp

**● firebaseApp**: *`ComputedProperty`<[FirebaseAppService](firebaseappservice.md), [FirebaseAppService](firebaseappservice.md)>*

*Defined in [authenticators/firebase.ts:18](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/authenticators/firebase.ts#L18)*

___

## Methods

<a id="authenticate"></a>

###  authenticate

▸ **authenticate**(): `Promise`<`never`>

*Defined in [authenticators/firebase.ts:24](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/authenticators/firebase.ts#L24)*

**Returns:** `Promise`<`never`>

___
<a id="invalidate"></a>

###  invalidate

▸ **invalidate**(): `Promise`<`void`>

*Defined in [authenticators/firebase.ts:28](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/authenticators/firebase.ts#L28)*

**Returns:** `Promise`<`void`>

___
<a id="restore"></a>

###  restore

▸ **restore**(data: *`any`*): `Promise`<`any`>

*Defined in [authenticators/firebase.ts:20](https://github.com/firebase/emberfire/blob/v3.0.0-rc.1/addon/authenticators/firebase.ts#L20)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| data | `any` |

**Returns:** `Promise`<`any`>

___

