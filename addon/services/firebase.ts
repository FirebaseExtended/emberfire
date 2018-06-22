// @ts-ignore typescript doesn't think this has a default export
import firebase from 'npm:firebase/app';
import Service from '@ember/service';

export default class Firebase extends Service.extend({

  app: firebase.app,
  apps: firebase.apps,
  initializeApp: firebase.initializeApp

}) {};

declare module '@ember/service' {
  interface Registry {
    firebase: Firebase;
  }
}