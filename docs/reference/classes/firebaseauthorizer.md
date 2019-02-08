[EmberFire](../README.md) > [FirebaseAuthorizer](../classes/firebaseauthorizer.md)

# Class: FirebaseAuthorizer

## Hierarchy

 `Base`

**↳ FirebaseAuthorizer**

## Index

### Constructors

* [constructor](firebaseauthorizer.md#constructor)

### Properties

* [concatenatedProperties](firebaseauthorizer.md#concatenatedproperties)
* [isDestroyed](firebaseauthorizer.md#isdestroyed)
* [isDestroying](firebaseauthorizer.md#isdestroying)
* [isClass](firebaseauthorizer.md#isclass)
* [isMethod](firebaseauthorizer.md#ismethod)

### Methods

* [_super](firebaseauthorizer.md#_super)
* [authorize](firebaseauthorizer.md#authorize)
* [destroy](firebaseauthorizer.md#destroy)
* [init](firebaseauthorizer.md#init)
* [toString](firebaseauthorizer.md#tostring)
* [willDestroy](firebaseauthorizer.md#willdestroy)
* [create](firebaseauthorizer.md#create)
* [detect](firebaseauthorizer.md#detect)
* [detectInstance](firebaseauthorizer.md#detectinstance)
* [eachComputedProperty](firebaseauthorizer.md#eachcomputedproperty)
* [extend](firebaseauthorizer.md#extend)
* [metaForProperty](firebaseauthorizer.md#metaforproperty)
* [reopen](firebaseauthorizer.md#reopen)
* [reopenClass](firebaseauthorizer.md#reopenclass)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new FirebaseAuthorizer**(properties?: *`undefined` \| `object`*): [FirebaseAuthorizer](firebaseauthorizer.md)

*Inherited from CoreObject.__constructor*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:11*

As of Ember 3.1, CoreObject constructor takes initial object properties as an argument. See: [https://github.com/emberjs/ember.js/commit/4709935854d4c29b0d2c054614d53fa2c55309b1](https://github.com/emberjs/ember.js/commit/4709935854d4c29b0d2c054614d53fa2c55309b1)

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` properties | `undefined` \| `object` |

**Returns:** [FirebaseAuthorizer](firebaseauthorizer.md)

___

## Properties

<a id="concatenatedproperties"></a>

###  concatenatedProperties

**● concatenatedProperties**: *`any`[]*

*Inherited from CoreObject.concatenatedProperties*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:30*

Defines the properties that will be concatenated from the superclass (instead of overridden).

*__default__*: null

___
<a id="isdestroyed"></a>

###  isDestroyed

**● isDestroyed**: *`boolean`*

*Inherited from CoreObject.isDestroyed*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:37*

Destroyed object property flag. If this property is true the observers and bindings were already removed by the effect of calling the destroy() method.

*__default__*: false

___
<a id="isdestroying"></a>

###  isDestroying

**● isDestroying**: *`boolean`*

*Inherited from CoreObject.isDestroying*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:43*

Destruction scheduled flag. The destroy() method has been called. The object stays intact until the end of the run loop at which point the isDestroyed flag is set.

*__default__*: false

___
<a id="isclass"></a>

### `<Static>` isClass

**● isClass**: *`boolean`*

*Inherited from CoreObject.isClass*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:263*

___
<a id="ismethod"></a>

### `<Static>` isMethod

**● isMethod**: *`boolean`*

*Inherited from CoreObject.isMethod*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:264*

___

## Methods

<a id="_super"></a>

###  _super

▸ **_super**(...args: *`any`[]*): `any`

*Inherited from CoreObject._super*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:18*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` args | `any`[] |

**Returns:** `any`

___
<a id="authorize"></a>

###  authorize

▸ **authorize**(data: *`any`*, cb: *`any`*): `void`

*Defined in [authorizers/firebase.ts:4](https://github.com/firebase/emberfire/blob/v3/addon/authorizers/firebase.ts#L4)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| data | `any` |
| cb | `any` |

**Returns:** `void`

___
<a id="destroy"></a>

###  destroy

▸ **destroy**(): `CoreObject`

*Inherited from CoreObject.destroy*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:54*

Destroys an object by setting the `isDestroyed` flag and removing its metadata, which effectively destroys observers and bindings. If you try to set a property on a destroyed object, an exception will be raised. Note that destruction is scheduled for the end of the run loop and does not happen immediately. It will set an isDestroying flag immediately.

**Returns:** `CoreObject`
receiver

___
<a id="init"></a>

###  init

▸ **init**(): `void`

*Inherited from CoreObject.init*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:24*

An overridable method called when objects are instantiated. By default, does nothing unless it is overridden during class definition.

**Returns:** `void`

___
<a id="tostring"></a>

###  toString

▸ **toString**(): `string`

*Inherited from CoreObject.toString*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:66*

Returns a string representation which attempts to provide more information than Javascript's toString typically does, in a generic way for all Ember objects (e.g., "[App.Person:ember1024](App.Person:ember1024)").

**Returns:** `string`
string representation

___
<a id="willdestroy"></a>

###  willDestroy

▸ **willDestroy**(): `void`

*Inherited from CoreObject.willDestroy*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:59*

Override to implement teardown.

**Returns:** `void`

___
<a id="create"></a>

### `<Static>` create

▸ **create**<`Class`>(this: *`Class`*): `InstanceType`<`Class`>

▸ **create**<`Class`,`T1`>(this: *`Class`*, arg1: *`T1` & `ThisType`<`T1` & `InstanceType`<`Class`>>*): `InstanceType`<`Class`> & `T1`

▸ **create**<`Class`,`T1`,`T2`>(this: *`Class`*, arg1: *`T1` & `ThisType`<`T1` & `InstanceType`<`Class`>>*, arg2: *`T2` & `ThisType`<`T2` & `InstanceType`<`Class`>>*): `InstanceType`<`Class`> & `T1` & `T2`

▸ **create**<`Class`,`T1`,`T2`,`T3`>(this: *`Class`*, arg1: *`T1` & `ThisType`<`T1` & `InstanceType`<`Class`>>*, arg2: *`T2` & `ThisType`<`T2` & `InstanceType`<`Class`>>*, arg3: *`T3` & `ThisType`<`T3` & `InstanceType`<`Class`>>*): `InstanceType`<`Class`> & `T1` & `T2` & `T3`

*Inherited from CoreObject.create*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:68*

**Type parameters:**

#### Class :  `CoreObject`
**Parameters:**

| Name | Type |
| ------ | ------ |
| this | `Class` |

**Returns:** `InstanceType`<`Class`>

*Inherited from CoreObject.create*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:72*

**Type parameters:**

#### Class :  `CoreObject`
#### T1 :  `EmberInstanceArguments`<`UnwrapComputedPropertySetters`<`InstanceType`<`Class`>>>
**Parameters:**

| Name | Type |
| ------ | ------ |
| this | `Class` |
| arg1 | `T1` & `ThisType`<`T1` & `InstanceType`<`Class`>> |

**Returns:** `InstanceType`<`Class`> & `T1`

*Inherited from CoreObject.create*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:82*

**Type parameters:**

#### Class :  `CoreObject`
#### T1 :  `EmberInstanceArguments`<`UnwrapComputedPropertySetters`<`InstanceType`<`Class`>>>
#### T2 :  `EmberInstanceArguments`<`UnwrapComputedPropertySetters`<`InstanceType`<`Class`>>>
**Parameters:**

| Name | Type |
| ------ | ------ |
| this | `Class` |
| arg1 | `T1` & `ThisType`<`T1` & `InstanceType`<`Class`>> |
| arg2 | `T2` & `ThisType`<`T2` & `InstanceType`<`Class`>> |

**Returns:** `InstanceType`<`Class`> & `T1` & `T2`

*Inherited from CoreObject.create*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:96*

**Type parameters:**

#### Class :  `CoreObject`
#### T1 :  `EmberInstanceArguments`<`UnwrapComputedPropertySetters`<`InstanceType`<`Class`>>>
#### T2 :  `EmberInstanceArguments`<`UnwrapComputedPropertySetters`<`InstanceType`<`Class`>>>
#### T3 :  `EmberInstanceArguments`<`UnwrapComputedPropertySetters`<`InstanceType`<`Class`>>>
**Parameters:**

| Name | Type |
| ------ | ------ |
| this | `Class` |
| arg1 | `T1` & `ThisType`<`T1` & `InstanceType`<`Class`>> |
| arg2 | `T2` & `ThisType`<`T2` & `InstanceType`<`Class`>> |
| arg3 | `T3` & `ThisType`<`T3` & `InstanceType`<`Class`>> |

**Returns:** `InstanceType`<`Class`> & `T1` & `T2` & `T3`

___
<a id="detect"></a>

### `<Static>` detect

▸ **detect**<`Statics`,`Instance`>(this: *`Statics` & `EmberClassConstructor`<`Instance`>*, obj: *`any`*): `boolean`

*Inherited from CoreObject.detect*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:240*

**Type parameters:**

#### Statics 
#### Instance 
**Parameters:**

| Name | Type |
| ------ | ------ |
| this | `Statics` & `EmberClassConstructor`<`Instance`> |
| obj | `any` |

**Returns:** `boolean`

___
<a id="detectinstance"></a>

### `<Static>` detectInstance

▸ **detectInstance**<`Instance`>(this: *`EmberClassConstructor`<`Instance`>*, obj: *`any`*): `boolean`

*Inherited from CoreObject.detectInstance*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:245*

**Type parameters:**

#### Instance 
**Parameters:**

| Name | Type |
| ------ | ------ |
| this | `EmberClassConstructor`<`Instance`> |
| obj | `any` |

**Returns:** `boolean`

___
<a id="eachcomputedproperty"></a>

### `<Static>` eachComputedProperty

▸ **eachComputedProperty**(callback: *`function`*, binding: *`__type`*): `void`

*Inherited from CoreObject.eachComputedProperty*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:254*

Iterate over each computed property for the class, passing its name and any associated metadata (see metaForProperty) to the callback.

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |
| binding | `__type` |

**Returns:** `void`

___
<a id="extend"></a>

### `<Static>` extend

▸ **extend**<`Statics`,`Instance`>(this: *`Statics` & `EmberClassConstructor`<`Instance`>*): `Objectify`<`Statics`> & `EmberClassConstructor`<`Instance`>

▸ **extend**<`Statics`,`Instance`,`T1`,`B1`>(this: *`Statics` & `EmberClassConstructor`<`Instance`>*, arg1: *`MixinOrLiteral`<`T1`, `B1`> & `ThisType`<`Fix`<`Instance` & `T1`>>*): `Objectify`<`Statics`> & `EmberClassConstructor`<`T1` & `Instance`>

▸ **extend**<`Statics`,`Instance`,`T1`,`B1`,`T2`,`B2`>(this: *`Statics` & `EmberClassConstructor`<`Instance`>*, arg1: *`MixinOrLiteral`<`T1`, `B1`> & `ThisType`<`Fix`<`Instance` & `T1`>>*, arg2: *`MixinOrLiteral`<`T2`, `B2`> & `ThisType`<`Fix`<`Instance` & `T1` & `T2`>>*): `Objectify`<`Statics`> & `EmberClassConstructor`<`T1` & `T2` & `Instance`>

▸ **extend**<`Statics`,`Instance`,`T1`,`B1`,`T2`,`B2`,`T3`,`B3`>(this: *`Statics` & `EmberClassConstructor`<`Instance`>*, arg1: *`MixinOrLiteral`<`T1`, `B1`> & `ThisType`<`Fix`<`Instance` & `T1`>>*, arg2: *`MixinOrLiteral`<`T2`, `B2`> & `ThisType`<`Fix`<`Instance` & `T1` & `T2`>>*, arg3: *`MixinOrLiteral`<`T3`, `B3`> & `ThisType`<`Fix`<`Instance` & `T1` & `T2` & `T3`>>*): `Objectify`<`Statics`> & `EmberClassConstructor`<`T1` & `T2` & `T3` & `Instance`>

▸ **extend**<`Statics`,`Instance`,`T1`,`B1`,`T2`,`B2`,`T3`,`B3`,`T4`,`B4`>(this: *`Statics` & `EmberClassConstructor`<`Instance`>*, arg1: *`MixinOrLiteral`<`T1`, `B1`> & `ThisType`<`Fix`<`Instance` & `T1`>>*, arg2: *`MixinOrLiteral`<`T2`, `B2`> & `ThisType`<`Fix`<`Instance` & `T1` & `T2`>>*, arg3: *`MixinOrLiteral`<`T3`, `B3`> & `ThisType`<`Fix`<`Instance` & `T1` & `T2` & `T3`>>*, arg4: *`MixinOrLiteral`<`T4`, `B4`> & `ThisType`<`Fix`<`Instance` & `T1` & `T2` & `T3` & `T4`>>*): `Objectify`<`Statics`> & `EmberClassConstructor`<`T1` & `T2` & `T3` & `T4` & `Instance`>

*Inherited from CoreObject.extend*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:114*

**Type parameters:**

#### Statics 
#### Instance 
**Parameters:**

| Name | Type |
| ------ | ------ |
| this | `Statics` & `EmberClassConstructor`<`Instance`> |

**Returns:** `Objectify`<`Statics`> & `EmberClassConstructor`<`Instance`>

*Inherited from CoreObject.extend*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:118*

**Type parameters:**

#### Statics 
#### Instance :  `B1`
#### T1 :  `EmberClassArguments`
#### B1 
**Parameters:**

| Name | Type |
| ------ | ------ |
| this | `Statics` & `EmberClassConstructor`<`Instance`> |
| arg1 | `MixinOrLiteral`<`T1`, `B1`> & `ThisType`<`Fix`<`Instance` & `T1`>> |

**Returns:** `Objectify`<`Statics`> & `EmberClassConstructor`<`T1` & `Instance`>

*Inherited from CoreObject.extend*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:128*

**Type parameters:**

#### Statics 
#### Instance :  `B1` & `B2`
#### T1 :  `EmberClassArguments`
#### B1 
#### T2 :  `EmberClassArguments`
#### B2 
**Parameters:**

| Name | Type |
| ------ | ------ |
| this | `Statics` & `EmberClassConstructor`<`Instance`> |
| arg1 | `MixinOrLiteral`<`T1`, `B1`> & `ThisType`<`Fix`<`Instance` & `T1`>> |
| arg2 | `MixinOrLiteral`<`T2`, `B2`> & `ThisType`<`Fix`<`Instance` & `T1` & `T2`>> |

**Returns:** `Objectify`<`Statics`> & `EmberClassConstructor`<`T1` & `T2` & `Instance`>

*Inherited from CoreObject.extend*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:141*

**Type parameters:**

#### Statics 
#### Instance :  `B1` & `B2` & `B3`
#### T1 :  `EmberClassArguments`
#### B1 
#### T2 :  `EmberClassArguments`
#### B2 
#### T3 :  `EmberClassArguments`
#### B3 
**Parameters:**

| Name | Type |
| ------ | ------ |
| this | `Statics` & `EmberClassConstructor`<`Instance`> |
| arg1 | `MixinOrLiteral`<`T1`, `B1`> & `ThisType`<`Fix`<`Instance` & `T1`>> |
| arg2 | `MixinOrLiteral`<`T2`, `B2`> & `ThisType`<`Fix`<`Instance` & `T1` & `T2`>> |
| arg3 | `MixinOrLiteral`<`T3`, `B3`> & `ThisType`<`Fix`<`Instance` & `T1` & `T2` & `T3`>> |

**Returns:** `Objectify`<`Statics`> & `EmberClassConstructor`<`T1` & `T2` & `T3` & `Instance`>

*Inherited from CoreObject.extend*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:157*

**Type parameters:**

#### Statics 
#### Instance :  `B1` & `B2` & `B3` & `B4`
#### T1 :  `EmberClassArguments`
#### B1 
#### T2 :  `EmberClassArguments`
#### B2 
#### T3 :  `EmberClassArguments`
#### B3 
#### T4 :  `EmberClassArguments`
#### B4 
**Parameters:**

| Name | Type |
| ------ | ------ |
| this | `Statics` & `EmberClassConstructor`<`Instance`> |
| arg1 | `MixinOrLiteral`<`T1`, `B1`> & `ThisType`<`Fix`<`Instance` & `T1`>> |
| arg2 | `MixinOrLiteral`<`T2`, `B2`> & `ThisType`<`Fix`<`Instance` & `T1` & `T2`>> |
| arg3 | `MixinOrLiteral`<`T3`, `B3`> & `ThisType`<`Fix`<`Instance` & `T1` & `T2` & `T3`>> |
| arg4 | `MixinOrLiteral`<`T4`, `B4`> & `ThisType`<`Fix`<`Instance` & `T1` & `T2` & `T3` & `T4`>> |

**Returns:** `Objectify`<`Statics`> & `EmberClassConstructor`<`T1` & `T2` & `T3` & `T4` & `Instance`>

___
<a id="metaforproperty"></a>

### `<Static>` metaForProperty

▸ **metaForProperty**(key: *`string`*): `__type`

*Inherited from CoreObject.metaForProperty*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:262*

Returns the original hash that was passed to meta().

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| key | `string` |  property name |

**Returns:** `__type`

___
<a id="reopen"></a>

### `<Static>` reopen

▸ **reopen**<`Statics`,`Instance`>(this: *`Statics` & `EmberClassConstructor`<`Instance`>*): `Objectify`<`Statics`> & `EmberClassConstructor`<`Instance`>

▸ **reopen**<`Statics`,`Instance`,`T1`,`B1`>(this: *`Statics` & `EmberClassConstructor`<`Instance`>*, arg1: *`MixinOrLiteral`<`T1`, `B1`> & `ThisType`<`Fix`<`Instance` & `T1`>>*): `Objectify`<`Statics`> & `EmberClassConstructor`<`Instance` & `T1`>

▸ **reopen**<`Statics`,`Instance`,`T1`,`B1`,`T2`,`B2`>(this: *`Statics` & `EmberClassConstructor`<`Instance`>*, arg1: *`MixinOrLiteral`<`T1`, `B1`> & `ThisType`<`Fix`<`Instance` & `T1`>>*, arg2: *`MixinOrLiteral`<`T2`, `B2`> & `ThisType`<`Fix`<`Instance` & `T1` & `T2`>>*): `Objectify`<`Statics`> & `EmberClassConstructor`<`Instance` & `T1` & `T2`>

▸ **reopen**<`Statics`,`Instance`,`T1`,`B1`,`T2`,`B2`,`T3`,`B3`>(this: *`Statics` & `EmberClassConstructor`<`Instance`>*, arg1: *`MixinOrLiteral`<`T1`, `B1`> & `ThisType`<`Fix`<`Instance` & `T1`>>*, arg2: *`MixinOrLiteral`<`T2`, `B2`> & `ThisType`<`Fix`<`Instance` & `T1` & `T2`>>*, arg3: *`MixinOrLiteral`<`T3`, `B3`> & `ThisType`<`Fix`<`Instance` & `T1` & `T2` & `T3`>>*): `Objectify`<`Statics`> & `EmberClassConstructor`<`Instance` & `T1` & `T2` & `T3`>

*Inherited from CoreObject.reopen*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:177*

**Type parameters:**

#### Statics 
#### Instance 
**Parameters:**

| Name | Type |
| ------ | ------ |
| this | `Statics` & `EmberClassConstructor`<`Instance`> |

**Returns:** `Objectify`<`Statics`> & `EmberClassConstructor`<`Instance`>

*Inherited from CoreObject.reopen*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:181*

**Type parameters:**

#### Statics 
#### Instance :  `B1`
#### T1 :  `EmberClassArguments`
#### B1 
**Parameters:**

| Name | Type |
| ------ | ------ |
| this | `Statics` & `EmberClassConstructor`<`Instance`> |
| arg1 | `MixinOrLiteral`<`T1`, `B1`> & `ThisType`<`Fix`<`Instance` & `T1`>> |

**Returns:** `Objectify`<`Statics`> & `EmberClassConstructor`<`Instance` & `T1`>

*Inherited from CoreObject.reopen*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:191*

**Type parameters:**

#### Statics 
#### Instance :  `B1` & `B2`
#### T1 :  `EmberClassArguments`
#### B1 
#### T2 :  `EmberClassArguments`
#### B2 
**Parameters:**

| Name | Type |
| ------ | ------ |
| this | `Statics` & `EmberClassConstructor`<`Instance`> |
| arg1 | `MixinOrLiteral`<`T1`, `B1`> & `ThisType`<`Fix`<`Instance` & `T1`>> |
| arg2 | `MixinOrLiteral`<`T2`, `B2`> & `ThisType`<`Fix`<`Instance` & `T1` & `T2`>> |

**Returns:** `Objectify`<`Statics`> & `EmberClassConstructor`<`Instance` & `T1` & `T2`>

*Inherited from CoreObject.reopen*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:204*

**Type parameters:**

#### Statics 
#### Instance :  `B1` & `B2` & `B3`
#### T1 :  `EmberClassArguments`
#### B1 
#### T2 :  `EmberClassArguments`
#### B2 
#### T3 :  `EmberClassArguments`
#### B3 
**Parameters:**

| Name | Type |
| ------ | ------ |
| this | `Statics` & `EmberClassConstructor`<`Instance`> |
| arg1 | `MixinOrLiteral`<`T1`, `B1`> & `ThisType`<`Fix`<`Instance` & `T1`>> |
| arg2 | `MixinOrLiteral`<`T2`, `B2`> & `ThisType`<`Fix`<`Instance` & `T1` & `T2`>> |
| arg3 | `MixinOrLiteral`<`T3`, `B3`> & `ThisType`<`Fix`<`Instance` & `T1` & `T2` & `T3`>> |

**Returns:** `Objectify`<`Statics`> & `EmberClassConstructor`<`Instance` & `T1` & `T2` & `T3`>

___
<a id="reopenclass"></a>

### `<Static>` reopenClass

▸ **reopenClass**<`Statics`>(this: *`Statics`*): `Statics`

▸ **reopenClass**<`Statics`,`T1`>(this: *`Statics`*, arg1: *`T1`*): `Statics` & `T1`

▸ **reopenClass**<`Statics`,`T1`,`T2`>(this: *`Statics`*, arg1: *`T1`*, arg2: *`T2`*): `Statics` & `T1` & `T2`

▸ **reopenClass**<`Statics`,`T1`,`T2`,`T3`>(this: *`Statics`*, arg1: *`T1`*, arg2: *`T2`*, arg3: *`T3`*): `Statics` & `T1` & `T2` & `T3`

*Inherited from CoreObject.reopenClass*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:220*

**Type parameters:**

#### Statics 
**Parameters:**

| Name | Type |
| ------ | ------ |
| this | `Statics` |

**Returns:** `Statics`

*Inherited from CoreObject.reopenClass*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:222*

**Type parameters:**

#### Statics 
#### T1 :  `EmberClassArguments`
**Parameters:**

| Name | Type |
| ------ | ------ |
| this | `Statics` |
| arg1 | `T1` |

**Returns:** `Statics` & `T1`

*Inherited from CoreObject.reopenClass*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:227*

**Type parameters:**

#### Statics 
#### T1 :  `EmberClassArguments`
#### T2 :  `EmberClassArguments`
**Parameters:**

| Name | Type |
| ------ | ------ |
| this | `Statics` |
| arg1 | `T1` |
| arg2 | `T2` |

**Returns:** `Statics` & `T1` & `T2`

*Inherited from CoreObject.reopenClass*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember__object/core.d.ts:233*

**Type parameters:**

#### Statics 
#### T1 :  `EmberClassArguments`
#### T2 :  `EmberClassArguments`
#### T3 :  `EmberClassArguments`
**Parameters:**

| Name | Type |
| ------ | ------ |
| this | `Statics` |
| arg1 | `T1` |
| arg2 | `T2` |
| arg3 | `T3` |

**Returns:** `Statics` & `T1` & `T2` & `T3`

___

