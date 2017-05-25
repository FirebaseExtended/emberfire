/* jshint expr:true */
import {
  describe,
  it,
  beforeEach,
  afterEach
} from 'mocha';
import { expect } from 'chai';
// import Ember from 'ember';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import replaceAppRef from '../helpers/replace-app-ref';
import stubFirebase from '../helpers/stub-firebase';
import unstubFirebase from '../helpers/unstub-firebase';
import createTestRef from '../helpers/create-test-ref';

// This test verifies that someone can use JSONAPIAdapter along side
// FirebaseAdapter in their application
describe('Acceptance: JSONAPIAdapter still works', function() {
  var application, ref;

  beforeEach(function() {
    stubFirebase();
    application = startApp();
    ref = createTestRef('acceptance');

    replaceAppRef(application, ref);
  });

  afterEach(function() {
    unstubFirebase();
    destroyApp(application);
  });

  it('can load widgets', function() {
    visit('/widgets');

    andThen(function() {
      expect(find('[data-test-widget=1] .name').text()).to.equal('WIDGET 1');
    });
  });

  it('can create widgets', function() {
    visit('/widgets');
    click('[data-test-create-widget]');

    andThen(function() {
      expect(find('[data-test-widget=2] .name').text()).to.equal('WIDGET 2');
    });
  });

  it('can update a widget with sideloaded data', function() {
    visit('/widgets');
    click('[data-test-update-widget=1]');

    andThen(function() {
      expect(find('[data-test-widget=1] .name').text()).to.equal('WIDGET 1 - UPDATED');
    });
  });

});


