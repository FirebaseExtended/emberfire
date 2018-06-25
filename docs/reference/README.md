
#  EmberFire

## Index

### Classes

* [FirebaseAppService](classes/firebaseappservice.md)
* [FirebaseAuthenticator](classes/firebaseauthenticator.md)
* [FirebaseAuthorizer](classes/firebaseauthorizer.md)
* [FirebaseService](classes/firebaseservice.md)
* [FirebaseSessionStore](classes/firebasesessionstore.md)
* [FirebaseToriiAdapter](classes/firebasetoriiadapter.md)
* [FirebaseToriiProvider](classes/firebasetoriiprovider.md)
* [FirestoreAdapter](classes/firestoreadapter.md)
* [FirestoreSerializer](classes/firestoreserializer.md)
* [RealtimeDatabaseAdapter](classes/realtimedatabaseadapter.md)
* [RealtimeDatabaseSerializer](classes/realtimedatabaseserializer.md)

### Type aliases

* [CollectionReferenceOrQuery](#collectionreferenceorquery)
* [DocumentSnapshot](#documentsnapshot)
* [QueryFn](#queryfn)
* [ReferenceOrQuery](#referenceorquery)
* [Snapshot](#snapshot)

---

## Type aliases

<a id="collectionreferenceorquery"></a>

###  CollectionReferenceOrQuery

**ΤCollectionReferenceOrQuery**: * `CollectionReference` &#124; `Query`
*

*Defined in [adapters/firestore.ts:14](https://github.com/firebase/emberfire/blob/c7f4d01/addon/adapters/firestore.ts#L14)*

___
<a id="documentsnapshot"></a>

###  DocumentSnapshot

**ΤDocumentSnapshot**: * `DocumentSnapshot` &#124; `QueryDocumentSnapshot`
*

*Defined in [serializers/firestore.ts:5](https://github.com/firebase/emberfire/blob/c7f4d01/addon/serializers/firestore.ts#L5)*

___
<a id="queryfn"></a>

###  QueryFn

**ΤQueryFn**: *`function`*

*Defined in [adapters/firestore.ts:15](https://github.com/firebase/emberfire/blob/c7f4d01/addon/adapters/firestore.ts#L15)*
*Defined in [adapters/realtime-database.ts:14](https://github.com/firebase/emberfire/blob/c7f4d01/addon/adapters/realtime-database.ts#L14)*

#### Type declaration
▸(ref: *[ReferenceOrQuery](#referenceorquery)*): [ReferenceOrQuery](#referenceorquery)

**Parameters:**

| Param | Type |
| ------ | ------ |
| ref | [ReferenceOrQuery](#referenceorquery) |

**Returns:** [ReferenceOrQuery](#referenceorquery)

___
<a id="referenceorquery"></a>

###  ReferenceOrQuery

**ΤReferenceOrQuery**: * `Reference` &#124; `Query`
*

*Defined in [adapters/realtime-database.ts:13](https://github.com/firebase/emberfire/blob/c7f4d01/addon/adapters/realtime-database.ts#L13)*

___
<a id="snapshot"></a>

###  Snapshot

**ΤSnapshot**: * `DocumentSnapshot` &#124; `QuerySnapshot`
*

*Defined in [serializers/firestore.ts:6](https://github.com/firebase/emberfire/blob/c7f4d01/addon/serializers/firestore.ts#L6)*

___

