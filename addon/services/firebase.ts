import { getOwner } from '@ember/application';
// @ts-ignore
import { default as firebase} from 'npm:firebase/app';
import Ember from 'ember';

export default class Firebase extends Ember.Service.extend({

  app: firebase.app,
  apps: firebase.apps,
  initializeApp: firebase.initializeApp,

  init() {
    const config = getOwner(this).resolveRegistration('config:environment');
    if (!config || typeof config.firebase !== 'object') {
      throw new Error('Please set the `firebase` property in your environment config.');
    }
    if (typeof config.firebase.length === 'undefined') {
      firebase.initializeApp(config.firebase)
    } else {
      config.firebase.forEach((config:any) => {
        const nameOrOptions = config.options || config.name;
        delete config.options;
        delete config.name;
        firebase.initializeApp(config, nameOrOptions);
      })
    }
  }

}) {};

declare module '@ember/service' {
  interface Registry {
    firebase: Firebase;
  }
}