import { test } from 'qunit';
import moduleForEmberfireAcceptance from '<%= testFolderRoot %>/tests/helpers/module-for-emberfire-acceptance';

moduleForEmberfireAcceptance('<%= friendlyTestName %>', {
  fixtureData: {
    /* books: { ... } */
  }
});

test('visiting /<%= dasherizedModuleName %>', function(assert) {
  visit('/<%= dasherizedModuleName %>');

  andThen(function() {
    assert.equal(currentURL(), '/<%= dasherizedModuleName %>');
  });
});
