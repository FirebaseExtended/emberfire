// @ts-ignore, no types
import XHR2 from 'xhr2';

const initialize = (application: any) => {
    // Polyfill XMLHttpRequest for Ember Fastboot, wtf global isn't working
    if (typeof XMLHttpRequest === 'undefined') { var XMLHttpRequest = XHR2; }

    const environment = application.resolveRegistration('config:environment');
    if (!environment || typeof environment.firebase !== 'object') {
        throw new Error('Please set the `firebase` property in your environment config.');
    }
    if (typeof environment.firebase.length === 'undefined') {
        loadEnvironment(application, environment.firebase);
    } else {
        environment.firebase.forEach((config:any) => loadEnvironment(application, config));
    }
};

import firebase from 'firebase/app';
import FirebaseAppService from '../services/firebase-app';

const loadEnvironment = (application:any, environment:any) => {
    const config = Object.assign({}, environment);
    delete config.options;
    delete config.name;
    const options = Object.assign({}, config.options);
    options.name = options.name || environment.name;
    firebase.initializeApp(config, options);
    const serviceName = options.name === '[DEFAULT]' && `firebase-app` || `firebase-${options.name}`;
    application.register(`service:${serviceName}`, FirebaseAppService.extend({ name: options.name }), { instantiate: true });
}

export default {
  name: 'emberfire',
  initialize: initialize
};