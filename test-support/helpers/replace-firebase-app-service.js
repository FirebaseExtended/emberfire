/**
 * Replaces the `firebaseApp` service with your own using injection overrides.
 *
 * This is usually not needed in test modules, where you can re-register over
 * existing names in the registry, but in acceptance tests, some registry/inject
 * magic is needed.
 *
 * @param  {!Ember.Application} app
 * @param  {!Object} newService
 */
export default function replaceFirebaseAppService(app, newService) {
  app.register(
      'service:firebaseAppMock', newService, {instantiate: false, singleton: true});
  app.inject('torii-provider:firebase', 'firebaseApp', 'service:firebaseAppMock');
  app.inject('torii-adapter:firebase', 'firebaseApp', 'service:firebaseAppMock');
}
