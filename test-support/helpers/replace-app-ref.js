/**
 * Updates the supplied app adapter's Firebase reference.
 *
 * @param  {!Ember.Application} app
 * @param  {!firebase.database.Reference} ref
 * @param  {string} [model]  The model, if overriding a model specific adapter
 */
export default function replaceAppRef(app, ref, model = 'application') {
  app.register('service:firebaseMock', ref, {instantiate: false, singleton: true});
  app.inject('adapter:firebase', 'firebase', 'service:firebaseMock');
  app.inject('adapter:' + model, 'firebase', 'service:firebaseMock');
}
