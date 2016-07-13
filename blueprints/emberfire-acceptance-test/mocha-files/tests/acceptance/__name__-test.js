/* jshint expr:true */
import { it } from 'mocha';
import { expect } from 'chai';
import describeEmberfireAcceptance from '../helpers/describe-emberfire-acceptance';
import startApp from '../helpers/start-app';
<% if (destroyAppExists) { %>import destroyApp from '../helpers/destroy-app';<% } else { %>import Ember from 'ember';<% } %>

describeEmberfireAcceptance('Acceptance: <%= classifiedModuleName %>', function() {
  it('can visit /<%= dasherizedModuleName %>', function() {
    visit('/<%= dasherizedModuleName %>');

    andThen(function() {
      expect(currentPath()).to.equal('<%= dasherizedModuleName %>');
    });
  });
});
