import Base from 'ember-simple-auth/authorizers/base';

export default Base.extend({
    authorize(data, cb) {
        data.credential.then(token => {
            cb('Authorization', `Bearer ${token}`);
        });
    }
});