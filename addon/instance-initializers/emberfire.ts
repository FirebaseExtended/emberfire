import firebase from 'npm:firebase/app';
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
    initialize: (application: any) => {
        const environment = application.resolveRegistration('config:environment');
        if (!environment || typeof environment.firebase !== 'object') {
            throw new Error('Please set the `firebase` property in your environment config.');
        }
        application.lookup('service:firebase');
        if (typeof environment.firebase.length === 'undefined') {
            loadEnvironment(application, environment.firebase);
        } else {
            environment.firebase.forEach((config:any) => loadEnvironment(application, config));
        }
    }
}