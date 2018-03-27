import { moduleFor, test } from 'ember-qunit';

moduleFor('service:firebase', 'Unit | Service | firebase');

test('should expose Firebase as a service', function(assert) {
  assert.expect(1);

  // Arrange
  this.register('config:environment', { firebase: {
    apiKey: '<api_key>',
    authDomain: '<auth_domain>',
    databaseURL: '<database_url>',
    projectId: '<project_id>',
    storageBucket: '<storage_bucket>',
    messagingSenderId: '<messaging_sender_id>',
  }});

  // Act
  const result = this.subject();

  // Assert
  assert.equal(result.app().name, '[DEFAULT]');
});