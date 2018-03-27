import { getOwner } from '@ember/application';
import _ from 'npm:@firebase/messaging';

export default {
  /**
   * @type {boolean}
   * @default
   * @readonly
   */
  isServiceFactory: true,

  app: undefined,

  /**
   * @param {Object} context
   * @return {firebase.messaging.Messaging} The Messaging service
   */
  create(context) {
    const firebase = getOwner(context).lookup('service:firebase');
    const messaging = firebase.messaging(this.app)
    // TODO not fastboot
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          messaging.useServiceWorker(registration);
        });
    }
    return messaging;
  }

};