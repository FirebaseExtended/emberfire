[EmberFire](../README.md) > [RealtimeDatabaseSerializer](../classes/realtimedatabaseserializer.md)

# Class: RealtimeDatabaseSerializer

## Hierarchy

 `JSONSerializer`

**↳ RealtimeDatabaseSerializer**

## Index

### Properties

* [attrs](realtimedatabaseserializer.md#attrs)
* [primaryKey](realtimedatabaseserializer.md#primarykey)
* [store](realtimedatabaseserializer.md#store)

### Methods

* [extractAttributes](realtimedatabaseserializer.md#extractattributes)
* [extractErrors](realtimedatabaseserializer.md#extracterrors)
* [extractId](realtimedatabaseserializer.md#extractid)
* [extractMeta](realtimedatabaseserializer.md#extractmeta)
* [extractPolymorphicRelationship](realtimedatabaseserializer.md#extractpolymorphicrelationship)
* [extractRelationship](realtimedatabaseserializer.md#extractrelationship)
* [extractRelationships](realtimedatabaseserializer.md#extractrelationships)
* [keyForAttribute](realtimedatabaseserializer.md#keyforattribute)
* [keyForLink](realtimedatabaseserializer.md#keyforlink)
* [keyForRelationship](realtimedatabaseserializer.md#keyforrelationship)
* [modelNameFromPayloadKey](realtimedatabaseserializer.md#modelnamefrompayloadkey)
* [modelNameFromPayloadType](realtimedatabaseserializer.md#modelnamefrompayloadtype)
* [normalize](realtimedatabaseserializer.md#normalize)
* [normalizeArrayResponse](realtimedatabaseserializer.md#normalizearrayresponse)
* [normalizeCreateRecordResponse](realtimedatabaseserializer.md#normalizecreaterecordresponse)
* [normalizeDeleteRecordResponse](realtimedatabaseserializer.md#normalizedeleterecordresponse)
* [normalizeFindAllResponse](realtimedatabaseserializer.md#normalizefindallresponse)
* [normalizeFindBelongsToResponse](realtimedatabaseserializer.md#normalizefindbelongstoresponse)
* [normalizeFindHasManyResponse](realtimedatabaseserializer.md#normalizefindhasmanyresponse)
* [normalizeFindManyResponse](realtimedatabaseserializer.md#normalizefindmanyresponse)
* [normalizeFindRecordResponse](realtimedatabaseserializer.md#normalizefindrecordresponse)
* [normalizeQueryRecordResponse](realtimedatabaseserializer.md#normalizequeryrecordresponse)
* [normalizeQueryResponse](realtimedatabaseserializer.md#normalizequeryresponse)
* [normalizeResponse](realtimedatabaseserializer.md#normalizeresponse)
* [normalizeSaveResponse](realtimedatabaseserializer.md#normalizesaveresponse)
* [normalizeSingleResponse](realtimedatabaseserializer.md#normalizesingleresponse)
* [normalizeUpdateRecordResponse](realtimedatabaseserializer.md#normalizeupdaterecordresponse)
* [serialize](realtimedatabaseserializer.md#serialize)
* [serializeAttribute](realtimedatabaseserializer.md#serializeattribute)
* [serializeBelongsTo](realtimedatabaseserializer.md#serializebelongsto)
* [serializeHasMany](realtimedatabaseserializer.md#serializehasmany)
* [serializeId](realtimedatabaseserializer.md#serializeid)
* [serializeIntoHash](realtimedatabaseserializer.md#serializeintohash)
* [serializePolymorphicType](realtimedatabaseserializer.md#serializepolymorphictype)
* [shouldSerializeHasMany](realtimedatabaseserializer.md#shouldserializehasmany)

---

## Properties

<a id="attrs"></a>

###  attrs

**● attrs**: *`__type`*

*Inherited from JSONSerializer.attrs*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1576*

The `attrs` object can be used to declare a simple mapping between property names on `DS.Model` records and payload keys in the serialized JSON object representing the record. An object with the property `key` can also be used to designate the attribute's key on the response payload.

___
<a id="primarykey"></a>

###  primaryKey

**● primaryKey**: *`string`*

*Inherited from JSONSerializer.primaryKey*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1568*

The `primaryKey` is used when serializing and deserializing data. Ember Data always uses the `id` property to store the id of the record. The external source may not always follow this convention. In these cases it is useful to override the `primaryKey` property to match the `primaryKey` of your external store.

___
<a id="store"></a>

###  store

**● store**: *`Store`*

*Inherited from Serializer.store*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:2142*

The `store` property is the application's `store` that contains all records. It can be used to look up serializers for other model types that may be nested inside the payload response.

___

## Methods

<a id="extractattributes"></a>

###  extractAttributes

▸ **extractAttributes**(modelClass: *`__type`*, resourceHash: *`__type`*): `__type`

*Inherited from JSONSerializer.extractAttributes*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1692*

Returns the resource's attributes formatted as a JSON-API "attributes object".

**Parameters:**

| Name | Type |
| ------ | ------ |
| modelClass | `__type` |
| resourceHash | `__type` |

**Returns:** `__type`

___
<a id="extracterrors"></a>

###  extractErrors

▸ **extractErrors**(store: *`Store`*, typeClass: *`Model`*, payload: *`__type`*, id: *`string` \| `number`*): `__type`

*Inherited from JSONSerializer.extractErrors*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1794*

`extractErrors` is used to extract model errors when a call to `DS.Model#save` fails with an `InvalidError`. By default Ember Data expects error information to be located on the `errors` property of the payload object.

**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| typeClass | `Model` |
| payload | `__type` |
| id | `string` \| `number` |

**Returns:** `__type`

___
<a id="extractid"></a>

###  extractId

▸ **extractId**(modelClass: *`__type`*, resourceHash: *`__type`*): `string`

*Inherited from JSONSerializer.extractId*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1688*

Returns the resource's ID.

**Parameters:**

| Name | Type |
| ------ | ------ |
| modelClass | `__type` |
| resourceHash | `__type` |

**Returns:** `string`

___
<a id="extractmeta"></a>

###  extractMeta

▸ **extractMeta**(store: *`Store`*, modelClass: *`Model`*, payload: *`__type`*): `any`

*Inherited from JSONSerializer.extractMeta*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1787*

`extractMeta` is used to deserialize any meta information in the adapter payload. By default Ember Data expects meta information to be located on the `meta` property of the payload object.

**Parameters:**

| Name | Type |
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

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1703*

Returns a polymorphic relationship formatted as a JSON-API "relationship object".

**Parameters:**

| Name | Type |
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

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1696*

Returns a relationship formatted as a JSON-API "relationship object".

**Parameters:**

| Name | Type |
| ------ | ------ |
| relationshipModelName | `__type` |
| relationshipHash | `__type` |

**Returns:** `__type`

___
<a id="extractrelationships"></a>

###  extractRelationships

▸ **extractRelationships**(modelClass: *`__type`*, resourceHash: *`__type`*): `__type`

*Inherited from JSONSerializer.extractRelationships*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1711*

Returns the resource's relationships formatted as a JSON-API "relationships object".

**Parameters:**

| Name | Type |
| ------ | ------ |
| modelClass | `__type` |
| resourceHash | `__type` |

**Returns:** `__type`

___
<a id="keyforattribute"></a>

###  keyForAttribute

▸ **keyForAttribute**(key: *`string`*, method: *`string`*): `string`

*Inherited from JSONSerializer.keyForAttribute*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1804*

`keyForAttribute` can be used to define rules for how to convert an attribute name in your model to a key in your JSON.

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| method | `string` |

**Returns:** `string`

___
<a id="keyforlink"></a>

###  keyForLink

▸ **keyForLink**(key: *`string`*, kind: *`string`*): `string`

*Inherited from JSONSerializer.keyForLink*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1819*

`keyForLink` can be used to define a custom key when deserializing link properties.

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| kind | `string` |

**Returns:** `string`

___
<a id="keyforrelationship"></a>

###  keyForRelationship

▸ **keyForRelationship**(key: *`string`*, typeClass: *`string`*, method: *`string`*): `string`

*Inherited from JSONSerializer.keyForRelationship*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1810*

`keyForRelationship` can be used to define a custom key when serializing and deserializing relationship properties. By default `JSONSerializer` does not provide an implementation of this method.

**Parameters:**

| Name | Type |
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

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1712*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |

**Returns:** `string`

___
<a id="modelnamefrompayloadtype"></a>

###  modelNameFromPayloadType

▸ **modelNameFromPayloadType**(type: *`string`*): `string`

*Inherited from JSONSerializer.modelNameFromPayloadType*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1820*

**Parameters:**

| Name | Type |
| ------ | ------ |
| type | `string` |

**Returns:** `string`

___
<a id="normalize"></a>

###  normalize

▸ **normalize**(typeClass: *`Model`*, hash: *`__type`*): `__type`

*Inherited from JSONSerializer.normalize*

*Overrides Serializer.normalize*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1684*

Normalizes a part of the JSON payload returned by the server. You should override this method, munge the hash and call super if you have generic normalization to do.

**Parameters:**

| Name | Type |
| ------ | ------ |
| typeClass | `Model` |
| hash | `__type` |

**Returns:** `__type`

___
<a id="normalizearrayresponse"></a>

###  normalizeArrayResponse

▸ **normalizeArrayResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`DataSnapshot`*, _id: *`string` \| `number`*, _requestType: *`string`*): `object`

*Overrides JSONSerializer.normalizeArrayResponse*

*Defined in [serializers/realtime-database.ts:12](https://github.com/firebase/emberfire/blob/v3/addon/serializers/realtime-database.ts#L12)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `DataSnapshot` |
| _id | `string` \| `number` |
| _requestType | `string` |

**Returns:** `object`

___
<a id="normalizecreaterecordresponse"></a>

###  normalizeCreateRecordResponse

▸ **normalizeCreateRecordResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: *`string` \| `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeCreateRecordResponse*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1637*

**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id | `string` \| `number` |
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizedeleterecordresponse"></a>

###  normalizeDeleteRecordResponse

▸ **normalizeDeleteRecordResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: *`string` \| `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeDeleteRecordResponse*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1644*

**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id | `string` \| `number` |
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizefindallresponse"></a>

###  normalizeFindAllResponse

▸ **normalizeFindAllResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: *`string` \| `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeFindAllResponse*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1602*

**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id | `string` \| `number` |
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizefindbelongstoresponse"></a>

###  normalizeFindBelongsToResponse

▸ **normalizeFindBelongsToResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: *`string` \| `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeFindBelongsToResponse*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1609*

**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id | `string` \| `number` |
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizefindhasmanyresponse"></a>

###  normalizeFindHasManyResponse

▸ **normalizeFindHasManyResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: *`string` \| `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeFindHasManyResponse*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1616*

**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id | `string` \| `number` |
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizefindmanyresponse"></a>

###  normalizeFindManyResponse

▸ **normalizeFindManyResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: *`string` \| `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeFindManyResponse*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1623*

**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id | `string` \| `number` |
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizefindrecordresponse"></a>

###  normalizeFindRecordResponse

▸ **normalizeFindRecordResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: *`string` \| `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeFindRecordResponse*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1588*

**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id | `string` \| `number` |
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizequeryrecordresponse"></a>

###  normalizeQueryRecordResponse

▸ **normalizeQueryRecordResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: *`string` \| `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeQueryRecordResponse*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1595*

**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id | `string` \| `number` |
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizequeryresponse"></a>

###  normalizeQueryResponse

▸ **normalizeQueryResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: *`string` \| `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeQueryResponse*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1630*

**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id | `string` \| `number` |
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizeresponse"></a>

###  normalizeResponse

▸ **normalizeResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: *`string` \| `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeResponse*

*Overrides Serializer.normalizeResponse*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1581*

The `normalizeResponse` method is used to normalize a payload from the server to a JSON-API Document.

**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id | `string` \| `number` |
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizesaveresponse"></a>

###  normalizeSaveResponse

▸ **normalizeSaveResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: *`string` \| `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeSaveResponse*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1658*

**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id | `string` \| `number` |
| requestType | `string` |

**Returns:** `__type`

___
<a id="normalizesingleresponse"></a>

###  normalizeSingleResponse

▸ **normalizeSingleResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`DataSnapshot`*, _id: *`string` \| `number`*, _requestType: *`string`*): `object`

*Overrides JSONSerializer.normalizeSingleResponse*

*Defined in [serializers/realtime-database.ts:7](https://github.com/firebase/emberfire/blob/v3/addon/serializers/realtime-database.ts#L7)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `DataSnapshot` |
| _id | `string` \| `number` |
| _requestType | `string` |

**Returns:** `object`

___
<a id="normalizeupdaterecordresponse"></a>

###  normalizeUpdateRecordResponse

▸ **normalizeUpdateRecordResponse**(store: *`Store`*, primaryModelClass: *`Model`*, payload: *`__type`*, id: *`string` \| `number`*, requestType: *`string`*): `__type`

*Inherited from JSONSerializer.normalizeUpdateRecordResponse*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1651*

**Parameters:**

| Name | Type |
| ------ | ------ |
| store | `Store` |
| primaryModelClass | `Model` |
| payload | `__type` |
| id | `string` \| `number` |
| requestType | `string` |

**Returns:** `__type`

___
<a id="serialize"></a>

###  serialize

▸ **serialize**<`K`>(snapshot: *`Snapshot`<`K`>*, options: *`__type`*): `__type`

*Inherited from JSONSerializer.serialize*

*Overrides Serializer.serialize*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1725*

Called when a record is saved in order to convert the record into JSON.

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| snapshot | `Snapshot`<`K`> |
| options | `__type` |

**Returns:** `__type`

___
<a id="serializeattribute"></a>

###  serializeAttribute

▸ **serializeAttribute**<`K`>(snapshot: *`Snapshot`<`K`>*, json: *`__type`*, key: *`string`*, attribute: *`__type`*): `any`

*Inherited from JSONSerializer.serializeAttribute*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1747*

`serializeAttribute` can be used to customize how `DS.attr` properties are serialized

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| snapshot | `Snapshot`<`K`> |
| json | `__type` |
| key | `string` |
| attribute | `__type` |

**Returns:** `any`

___
<a id="serializebelongsto"></a>

###  serializeBelongsTo

▸ **serializeBelongsTo**<`K`>(snapshot: *`Snapshot`<`K`>*, json: *`__type`*, relationship: *`__type`*): `any`

*Inherited from JSONSerializer.serializeBelongsTo*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1757*

`serializeBelongsTo` can be used to customize how `DS.belongsTo` properties are serialized.

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| snapshot | `Snapshot`<`K`> |
| json | `__type` |
| relationship | `__type` |

**Returns:** `any`

___
<a id="serializehasmany"></a>

###  serializeHasMany

▸ **serializeHasMany**<`K`>(snapshot: *`Snapshot`<`K`>*, json: *`__type`*, relationship: *`__type`*): `any`

*Inherited from JSONSerializer.serializeHasMany*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1766*

`serializeHasMany` can be used to customize how `DS.hasMany` properties are serialized.

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| snapshot | `Snapshot`<`K`> |
| json | `__type` |
| relationship | `__type` |

**Returns:** `any`

___
<a id="serializeid"></a>

###  serializeId

▸ **serializeId**<`K`>(snapshot: *`Snapshot`<`K`>*, json: *`__type`*, primaryKey: *`string`*): `any`

*Inherited from JSONSerializer.serializeId*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1825*

serializeId can be used to customize how id is serialized For example, your server may expect integer datatype of id

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| snapshot | `Snapshot`<`K`> |
| json | `__type` |
| primaryKey | `string` |

**Returns:** `any`

___
<a id="serializeintohash"></a>

###  serializeIntoHash

▸ **serializeIntoHash**<`K`>(hash: *`__type`*, typeClass: *`ModelRegistry[K]`*, snapshot: *`Snapshot`<`K`>*, options?: *`undefined` \| `__type`*): `any`

*Inherited from JSONSerializer.serializeIntoHash*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1737*

You can use this method to customize how a serialized record is added to the complete JSON hash to be sent to the server. By default the JSON Serializer does not namespace the payload and just sends the raw serialized JSON object. If your server expects namespaced keys, you should consider using the RESTSerializer. Otherwise you can override this method to customize how the record is added to the hash. The hash property should be modified by reference.

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| hash | `__type` |
| typeClass | `ModelRegistry[K]` |
| snapshot | `Snapshot`<`K`> |
| `Optional` options | `undefined` \| `__type` |

**Returns:** `any`

___
<a id="serializepolymorphictype"></a>

###  serializePolymorphicType

▸ **serializePolymorphicType**<`K`>(snapshot: *`Snapshot`<`K`>*, json: *`__type`*, relationship: *`__type`*): `any`

*Inherited from JSONSerializer.serializePolymorphicType*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1777*

You can use this method to customize how polymorphic objects are serialized. Objects are considered to be polymorphic if `{ polymorphic: true }` is pass as the second argument to the `DS.belongsTo` function.

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| snapshot | `Snapshot`<`K`> |
| json | `__type` |
| relationship | `__type` |

**Returns:** `any`

___
<a id="shouldserializehasmany"></a>

###  shouldSerializeHasMany

▸ **shouldSerializeHasMany**<`K`>(snapshot: *`Snapshot`<`K`>*, key: *`string`*, relationshipType: *`string`*): `boolean`

*Inherited from JSONSerializer.shouldSerializeHasMany*

*Defined in /Users/james/Code/Firebase/emberfire/node_modules/@types/ember-data/index.d.ts:1716*

Check if the given hasMany relationship should be serialized

**Type parameters:**

#### K :  `keyof ModelRegistry`
**Parameters:**

| Name | Type |
| ------ | ------ |
| snapshot | `Snapshot`<`K`> |
| key | `string` |
| relationshipType | `string` |

**Returns:** `boolean`

___

