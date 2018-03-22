import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('somethings', {path: '/'}, () => {
    this.route('something', {path: 'somethings/:id'});
  });
  this.route('users', () => {
    this.route('user', {path: 'users/:id'});
  });
});

export default Router;
