import { moduleFor, test } from 'ember-qunit';

moduleFor('service:firebase', 'Unit | Service | firebase');

test('should expose Firebase as a service', function (assert) {
  assert.expect(3);

  const result = this.subject();

  assert.ok(result.app);
  assert.ok(result.initializeApp);
  assert.ok(result.apps);
});
