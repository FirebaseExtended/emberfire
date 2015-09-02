import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('posts', { path: '/posts' }, function() {
    this.route('new');
  });
  this.route('post', { path: '/post/:post_id' });
  this.route('user', { path: '/user/:user_id' });
  this.route('auth');
});

export default Router;
