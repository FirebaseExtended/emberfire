import firebase from 'npm:firebase/app';

export default {
    name: 'emberfire',
    initialize: (application: any) => {
        const config = application.resolveRegistration('config:environment');
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
}