/* jshint expr:true */
import { it } from 'mocha';
import { expect } from 'chai';
import describeEmberfireAcceptance from '../helpers/describe-emberfire-acceptance';

describeEmberfireAcceptance('Acceptance: <%= classifiedModuleName %>', function() {
  it('can visit /<%= dasherizedModuleName %>', function() {
    visit('/<%= dasherizedModuleName %>');

    andThen(function() {
      expect(currentPath()).to.equal('<%= dasherizedModuleName %>');
    });
  });
});
