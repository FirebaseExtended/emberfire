import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
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
  this.route('comments', () => {
    this.route('comment', {path: 'comments/:id'});
  });
});

export default Router;
