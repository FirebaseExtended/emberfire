[EmberFire](../README.md) > [FirestoreSerializer](../classes/firestoreserializer.md)

# Class: FirestoreSerializer

## Hierarchy

 `JSONSerializer`

**↳ FirestoreSerializer**

## Index

### Properties

* [attrs](firestoreserializer.md#attrs)
* [primaryKey](firestoreserializer.md#primarykey)
* [store](firestoreserializer.md#store)

### Methods

* [extractAttributes](firestoreserializer.md#extractattributes)
* [extractErrors](firestoreserializer.md#extracterrors)
* [extractId](firestoreserializer.md#extractid)
* [extractMeta](firestoreserializer.md#extractmeta)
* [extractPolymorphicRelationship](firestoreserializer.md#extractpolymorphicrelationship)
* [extractRelationship](firestoreserializer.md#extractrelationship)
* [extractRelationships](firestoreserializer.md#extractrelationships)
* [keyForAttribute](firestoreserializer.md#keyforattribute)
* [keyForLink](firestoreserializer.md#keyforlink)
* [keyForRelationship](firestoreserializer.md#keyforrelationship)
* [modelNameFromPayloadKey](firestoreserializer.md#modelnamefrompayloadkey)
* [modelNameFromPayloadType](firestoreserializer.md#modelnamefrompayloadtype)
* [normalize](firestoreserializer.md#normalize)
* [normalizeArrayResponse](firestoreserializer.md#normalizearrayresponse)
* [normalizeCreateRecordResponse](firestoreserializer.md#normalizecreaterecordresponse)
* [normalizeDeleteRecordResponse](firestoreserializer.md#normalizedeleterecordresponse)
* [normalizeFindAllResponse](firestoreserializer.md#normalizefindallresponse)
* [normalizeFindBelongsToResponse](firestoreserializer.md#normalizefindbelongstoresponse)
* [normalizeFindHasManyResponse](firestoreserializer.md#normalizefindhasmanyresponse)
* [normalizeFindManyResponse](firestoreserializer.md#normalizefindmanyresponse)
* [normalizeFindRecordResponse](firestoreserializer.md#normalizefindrecordresponse)
* [normalizeQueryRecordResponse](firestoreserializer.md#normalizequeryrecordresponse)
* [normalizeQueryResponse](firestoreserializer.md#normalizequeryresponse)
* [normalizeResponse](firestoreserializer.md#normalizeresponse)
* [normalizeSaveResponse](firestoreserializer.md#normalizesaveresponse)
* [normalizeSingleResponse](firestoreserializer.md#normalizesingleresponse)
* [normalizeUpdateRecordResponse](firestoreserializer.md#normalizeupdaterecordresponse)
* [serialize](firestoreserializer.md#serialize)
* [serializeAttribute](firestoreserializer.md#serializeattribute)
* [serializeBelongsTo](firestoreserializer.md#serializebelongsto)
* [serializeHasMany](firestoreserializer.md#serializehasmany)
* [serializeId](firestoreserializer.md#serializeid)
* [serializeIntoHash](firestoreserializer.md#serializeintohash)
* [serializePolymorphicType](firestoreserializer.md#serializepolymorphictype)
* [shouldSerializeHasMany](firestoreserializer.md#shouldserializehasmany)

---

## Properties

<a id="attrs"></a>

###  attrs

**● attrs**: *`__type`*

*Inherited from JSONSerializer.attrs*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1516*

The `attrs` object can be used to declare a simple mapping between property names on `DS.Model` records and payload keys in the serialized JSON object representing the record. An object with the property `key` can also be used to designate the attribute's key on the response payload.

___
<a id="primarykey"></a>

###  primaryKey

**● primaryKey**: *`string`*

*Inherited from JSONSerializer.primaryKey*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1508*

The `primaryKey` is used when serializing and deserializing data. Ember Data always uses the `id` property to store the id of the record. The external source may not always follow this convention. In these cases it is useful to override the `primaryKey` property to match the `primaryKey` of your external store.

___
<a id="store"></a>

###  store

**● store**: *`Store`*

*Inherited from Serializer.store*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:2062*

The `store` property is the application's `store` that contains all records. It can be used to look up serializers for other model types that may be nested inside the payload response.

___

## Methods

<a id="extractattributes"></a>

###  extractAttributes

▸ **extractAttributes**(modelClass: *`__type`*, resourceHash: *`__type`*): `__type`

*Inherited from JSONSerializer.extractAttributes*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1632*

Returns the resource's attributes formatted as a JSON-API "attributes object".

**Parameters:**

| Param | Type |
| ------ | ------ |
| modelClass | `__type` |
| resourceHash | `__type` |

**Returns:** `__type`

___
<a id="extracterrors"></a>

###  extractErrors

▸ **extractErrors**(store: *`Store`*, typeClass: *`Model`*, payload: *`__type`*, id: * `string` &#124; `number`*): `__type`

*Inherited from JSONSerializer.extractErrors*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1731*

`extractErrors` is used to extract model errors when a call to `DS.Model#save` fails with an `InvalidError`. By default Ember Data expects error information to be located on the `errors` property of the payload object.

**Parameters:**

| Param | Type |
| ------ | ------ |
| store | `Store` |
| typeClass | `Model` |
| payload | `__type` |
| id |  `string` &#124; `number`|

**Returns:** `__type`

___
<a id="extractid"></a>

###  extractId

▸ **extractId**(modelClass: *`__type`*, resourceHash: *`__type`*): `string`

*Inherited from JSONSerializer.extractId*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1628*

Returns the resource's ID.

**Parameters:**

| Param | Type |
| ------ | ------ |
| modelClass | `__type` |
| resourceHash | `__type` |

**Returns:** `string`

___
<a id="extractmeta"></a>

###  extractMeta

▸ **extractMeta**(store: *`Store`*, modelClass: *`Model`*, payload: *`__type`*): `any`

*Inherited from JSONSerializer.extractMeta*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1724*

`extractMeta` is used to deserialize any meta information in the adapter payload. By default Ember Data expects meta information to be located on the `meta` property of the payload object.

**Parameters:**

| Param | Type |
| ------ | ------ |
| store | `Store` |
| modelClass | `Model` |
| payload | `__type` |

**Returns:** `any`

___
<a id="extractpolymorphicrelationship"></a>

###  extractPolymorphicRelationship

▸ **extractPolymorphicRelationship**(relationshipModelName: *`__type`*, relationshipHash: *`__type`*, relationshipOptions: *`__type`*): `__type`

*Inherited from JSONSerializer.extractPolymorphicRelationship*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1643*

Returns a polymorphic relationship formatted as a JSON-API "relationship object".

**Parameters:**

| Param | Type |
| ------ | ------ |
| relationshipModelName | `__type` |
| relationshipHash | `__type` |
| relationshipOptions | `__type` |

**Returns:** `__type`

___
<a id="extractrelationship"></a>

###  extractRelationship

▸ **extractRelationship**(relationshipModelName: *`__type`*, relationshipHash: *`__type`*): `__type`

*Inherited from JSONSerializer.extractRelationship*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1636*

Returns a relationship formatted as a JSON-API "relationship object".

**Parameters:**

| Param | Type |
| ------ | ------ |
| relationshipModelName | `__type` |
| relationshipHash | `__type` |

**Returns:** `__type`

___
<a id="extractrelationships"></a>

###  extractRelationships

▸ **extractRelationships**(modelClass: *`__type`*, resourceHash: *`__type`*): `__type`

*Inherited from JSONSerializer.extractRelationships*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1651*

Returns the resource's relationships formatted as a JSON-API "relationships object".

**Parameters:**

| Param | Type |
| ------ | ------ |
| modelClass | `__type` |
| resourceHash | `__type` |

**Returns:** `__type`

___
<a id="keyforattribute"></a>

###  keyForAttribute

▸ **keyForAttribute**(key: *`string`*, method: *`string`*): `string`

*Inherited from JSONSerializer.keyForAttribute*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1741*

`keyForAttribute` can be used to define rules for how to convert an attribute name in your model to a key in your JSON.

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `string` |
| method | `string` |

**Returns:** `string`

___
<a id="keyforlink"></a>

###  keyForLink

▸ **keyForLink**(key: *`string`*, kind: *`string`*): `string`

*Inherited from JSONSerializer.keyForLink*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1756*

`keyForLink` can be used to define a custom key when deserializing link properties.

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `string` |
| kind | `string` |

**Returns:** `string`

___
<a id="keyforrelationship"></a>

###  keyForRelationship

▸ **keyForRelationship**(key: *`string`*, typeClass: *`string`*, method: *`string`*): `string`

*Inherited from JSONSerializer.keyForRelationship*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1747*

`keyForRelationship` can be used to define a custom key when serializing and deserializing relationship properties. By default `JSONSerializer` does not provide an implementation of this method.

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `string` |
| typeClass | `string` |
| method | `string` |

**Returns:** `string`

___
<a id="modelnamefrompayloadkey"></a>

###  modelNameFromPayloadKey

▸ **modelNameFromPayloadKey**(key: *`string`*): `string`

*Inherited from JSONSerializer.modelNameFromPayloadKey*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1652*

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `string` |

**Returns:** `string`

___
<a id="modelnamefrompayloadtype"></a>

###  modelNameFromPayloadType

▸ **modelNameFromPayloadType**(type: *`string`*): `string`

*Inherited from JSONSerializer.modelNameFromPayloadType*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1757*

**Parameters:**

| Param | Type |
| ------ | ------ |
| type | `string` |

**Returns:** `string`

___
<a id="normalize"></a>

###  normalize

▸ **normalize**(typeClass: *`Model`*, hash: *`__type`*): `__type`

*Inherited from JSONSerializer.normalize*

*Overrides Serializer.normalize*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1624*

Normalizes a part of the JSON payload returned by the server. You should override this method, munge the hash and call super if you have generic normalization to do.

**Parameters:**

| Param | Type |
| ------ | ------ |
| typeClass | `Model` |
| hash | `__type` |

**Returns:** `__type`

___
<a id="normalizearrayresponse"></a>

###  normalizeArrayResponse

▸ **normalizeArrayResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`QuerySnapshot`*, _id: * `string` &#124; `number`*, _requestType: *`string`*): `object`

*Overrides JSONSerializer.normalizeArrayResponse*

*Defined in [serializers/firestore.ts:18](https://github.com/firebase/emberfire/blob/ffe43cd/addon/serializers/firestore.ts#L18)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `QuerySnapshot` |
| _id |  `string` &#124; `number`|
| _requestType | `string` |

**Returns:** `object`

___
<a id="normalizecreaterecordresponse"></a>

###  normalizeCreateRecordResponse

▸ **normalizeCreateRecordResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: * `string` &#124; `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeCreateRecordResponse*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1577*

**Parameters:**

| Param | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id |  `string` &#124; `number`|
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizedeleterecordresponse"></a>

###  normalizeDeleteRecordResponse

▸ **normalizeDeleteRecordResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: * `string` &#124; `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeDeleteRecordResponse*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1584*

**Parameters:**

| Param | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id |  `string` &#124; `number`|
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizefindallresponse"></a>

###  normalizeFindAllResponse

▸ **normalizeFindAllResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: * `string` &#124; `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeFindAllResponse*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1542*

**Parameters:**

| Param | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id |  `string` &#124; `number`|
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizefindbelongstoresponse"></a>

###  normalizeFindBelongsToResponse

▸ **normalizeFindBelongsToResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: * `string` &#124; `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeFindBelongsToResponse*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1549*

**Parameters:**

| Param | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id |  `string` &#124; `number`|
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizefindhasmanyresponse"></a>

###  normalizeFindHasManyResponse

▸ **normalizeFindHasManyResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: * `string` &#124; `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeFindHasManyResponse*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1556*

**Parameters:**

| Param | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id |  `string` &#124; `number`|
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizefindmanyresponse"></a>

###  normalizeFindManyResponse

▸ **normalizeFindManyResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: * `string` &#124; `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeFindManyResponse*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1563*

**Parameters:**

| Param | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id |  `string` &#124; `number`|
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizefindrecordresponse"></a>

###  normalizeFindRecordResponse

▸ **normalizeFindRecordResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: * `string` &#124; `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeFindRecordResponse*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1528*

**Parameters:**

| Param | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id |  `string` &#124; `number`|
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizequeryrecordresponse"></a>

###  normalizeQueryRecordResponse

▸ **normalizeQueryRecordResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: * `string` &#124; `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeQueryRecordResponse*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1535*

**Parameters:**

| Param | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id |  `string` &#124; `number`|
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizequeryresponse"></a>

###  normalizeQueryResponse

▸ **normalizeQueryResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: * `string` &#124; `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeQueryResponse*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1570*

**Parameters:**

| Param | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id |  `string` &#124; `number`|
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizeresponse"></a>

###  normalizeResponse

▸ **normalizeResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: * `string` &#124; `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeResponse*

*Overrides Serializer.normalizeResponse*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1521*

The `normalizeResponse` method is used to normalize a payload from the server to a JSON-API Document.

**Parameters:**

| Param | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id |  `string` &#124; `number`|
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizesaveresponse"></a>

###  normalizeSaveResponse

▸ **normalizeSaveResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: * `string` &#124; `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeSaveResponse*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1598*

**Parameters:**

| Param | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id |  `string` &#124; `number`|
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizesingleresponse"></a>

###  normalizeSingleResponse

▸ **normalizeSingleResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`DocumentSnapshot`*, _id: * `string` &#124; `number`*, _requestType: *`string`*): `object`

*Overrides JSONSerializer.normalizeSingleResponse*

*Defined in [serializers/firestore.ts:11](https://github.com/firebase/emberfire/blob/ffe43cd/addon/serializers/firestore.ts#L11)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `DocumentSnapshot` |
| _id |  `string` &#124; `number`|
| _requestType | `string` |

**Returns:** `object`

___
<a id="normalizeupdaterecordresponse"></a>

###  normalizeUpdateRecordResponse

▸ **normalizeUpdateRecordResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: * `string` &#124; `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeUpdateRecordResponse*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1591*

**Parameters:**

| Param | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id |  `string` &#124; `number`|
| requestType | `string` |

**Returns:** `__type`

___
<a id="serialize"></a>

###  serialize

▸ **serialize**K(snapshot: *`Snapshot`<`K`>*, options: *`__type`*): `__type`

*Inherited from JSONSerializer.serialize*

*Overrides Serializer.serialize*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1665*

Called when a record is saved in order to convert the record into JSON.

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Param | Type |
| ------ | ------ |
| snapshot | `Snapshot`<`K`> |
| options | `__type` |

**Returns:** `__type`

___
<a id="serializeattribute"></a>

###  serializeAttribute

▸ **serializeAttribute**K(snapshot: *`Snapshot`<`K`>*, json: *`__type`*, key: *`string`*, attribute: *`__type`*): `any`

*Inherited from JSONSerializer.serializeAttribute*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1684*

`serializeAttribute` can be used to customize how `DS.attr` properties are serialized

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Param | Type |
| ------ | ------ |
| snapshot | `Snapshot`<`K`> |
| json | `__type` |
| key | `string` |
| attribute | `__type` |

**Returns:** `any`

___
<a id="serializebelongsto"></a>

###  serializeBelongsTo

▸ **serializeBelongsTo**K(snapshot: *`Snapshot`<`K`>*, json: *`__type`*, relationship: *`__type`*): `any`

*Inherited from JSONSerializer.serializeBelongsTo*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1694*

`serializeBelongsTo` can be used to customize how `DS.belongsTo` properties are serialized.

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Param | Type |
| ------ | ------ |
| snapshot | `Snapshot`<`K`> |
| json | `__type` |
| relationship | `__type` |

**Returns:** `any`

___
<a id="serializehasmany"></a>

###  serializeHasMany

▸ **serializeHasMany**K(snapshot: *`Snapshot`<`K`>*, json: *`__type`*, relationship: *`__type`*): `any`

*Inherited from JSONSerializer.serializeHasMany*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1703*

`serializeHasMany` can be used to customize how `DS.hasMany` properties are serialized.

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Param | Type |
| ------ | ------ |
| snapshot | `Snapshot`<`K`> |
| json | `__type` |
| relationship | `__type` |

**Returns:** `any`

___
<a id="serializeid"></a>

###  serializeId

▸ **serializeId**K(snapshot: *`Snapshot`<`K`>*, json: *`__type`*, primaryKey: *`string`*): `any`

*Inherited from JSONSerializer.serializeId*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1762*

serializeId can be used to customize how id is serialized For example, your server may expect integer datatype of id

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Param | Type |
| ------ | ------ |
| snapshot | `Snapshot`<`K`> |
| json | `__type` |
| primaryKey | `string` |

**Returns:** `any`

___
<a id="serializeintohash"></a>

###  serializeIntoHash

▸ **serializeIntoHash**K(hash: *`__type`*, typeClass: *`ModelRegistry[K]`*, snapshot: *`Snapshot`<`K`>*, options?: * `undefined` &#124; `__type`*): `any`

*Inherited from JSONSerializer.serializeIntoHash*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1674*

You can use this method to customize how a serialized record is added to the complete JSON hash to be sent to the server. By default the JSON Serializer does not namespace the payload and just sends the raw serialized JSON object. If your server expects namespaced keys, you should consider using the RESTSerializer. Otherwise you can override this method to customize how the record is added to the hash. The hash property should be modified by reference.

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Param | Type |
| ------ | ------ |
| hash | `__type` |
| typeClass | `ModelRegistry[K]` |
| snapshot | `Snapshot`<`K`> |
| `Optional` options |  `undefined` &#124; `__type`|

**Returns:** `any`

___
<a id="serializepolymorphictype"></a>

###  serializePolymorphicType

▸ **serializePolymorphicType**K(snapshot: *`Snapshot`<`K`>*, json: *`__type`*, relationship: *`__type`*): `any`

*Inherited from JSONSerializer.serializePolymorphicType*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1714*

You can use this method to customize how polymorphic objects are serialized. Objects are considered to be polymorphic if `{ polymorphic: true }` is pass as the second argument to the `DS.belongsTo` function.

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Param | Type |
| ------ | ------ |
| snapshot | `Snapshot`<`K`> |
| json | `__type` |
| relationship | `__type` |

**Returns:** `any`

___
<a id="shouldserializehasmany"></a>

###  shouldSerializeHasMany

▸ **shouldSerializeHasMany**K(snapshot: *`Snapshot`<`K`>*, key: *`string`*, relationshipType: *`string`*): `boolean`

*Inherited from JSONSerializer.shouldSerializeHasMany*

*Defined in /Users/jamesdaniels/Code/emberfire/node_modules/@types/ember-data/index.d.ts:1656*

Check if the given hasMany relationship should be serialized

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Param | Type |
| ------ | ------ |
| snapshot | `Snapshot`<`K`> |
| key | `string` |
| relationshipType | `string` |

**Returns:** `boolean`

___

