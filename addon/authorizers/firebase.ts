import BaseAuthorizer from 'ember-simple-auth/authorizers/base';

export default class FirebaseAuthorizer extends BaseAuthorizer {
    authorize(data:any, cb:any) {
        data.credential.then((token:string) => {
            cb('Authorization', `Bearer ${token}`);
        });
    }
};