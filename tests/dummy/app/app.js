import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

var App;

Ember.MODEL_FACTORY_INJECTIONS = true;

import markdownHelper from 'dummy/helpers/markdown';
Ember.Handlebars.helper('markdown', markdownHelper);

import breaklinesHelper from 'dummy/helpers/breaklines';
Ember.Handlebars.helper('breaklines', breaklinesHelper);


App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
