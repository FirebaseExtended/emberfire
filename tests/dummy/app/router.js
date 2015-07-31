import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('posts', { path: '/posts' }, function() {
    this.route('new');
  });
  this.resource('post', { path: '/post/:post_id' });
  this.resource('user', { path: '/user/:user_id' });
  this.route('auth');
});

export default Router;
