import FirebaseSerializer from 'emberfire/serializers/firebase';

export default FirebaseSerializer.extend({
  attrs: {
    children: { embedded: 'always' },
    config: { embedded: 'always' }
  }
});
