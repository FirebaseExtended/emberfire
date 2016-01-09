/**
 * Updates the supplied app adapter's Firebase reference.
 *
 * @param  {Ember.Application} app
 * @param  {Firebase} ref
 * @param  {String} [model]  The model, if overriding a model specific adapter
 */
export default function replaceAppRef(app, ref, model = 'application') {
  var store = app.__container__.lookup('service:store');
  var adapter = store.adapterFor(model);

  adapter._ref = ref;
  adapter._queueFlushDelay = false;
}
