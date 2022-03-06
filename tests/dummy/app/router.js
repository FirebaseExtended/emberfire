import EmberRouter from '@ember/routing/router';
import config from 'dummy/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('somethings', { path: '/' }, () => {
    this.route('something', { path: 'somethings/:id' });
  });
  this.route('users', () => {
    this.route('user', { path: 'users/:id' });
  });
  this.route('comments', () => {
    this.route('comment', { path: 'comments/:id' });
  });
});
