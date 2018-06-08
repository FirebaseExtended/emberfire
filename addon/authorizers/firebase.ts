import Base from 'ember-simple-auth/authorizers/base';

export default Base.extend({
    authorize(data:any, cb:any) {
        data.credential.then((token:string) => {
            cb('Authorization', `Bearer ${token}`);
        });
    }
});