import * as firebase from 'firebase/app';
import Ember from 'ember';

export default class Firebase extends Ember.Service.extend({

  app: firebase.app,
  apps: firebase.apps,
  initializeApp: firebase.initializeApp

}) {};

declare module '@ember/service' {
  interface Registry {
    firebase: Firebase;
  }
}