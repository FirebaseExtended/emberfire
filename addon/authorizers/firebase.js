import Base from 'ember-simple-auth/authorizers/base';
import _ from 'npm:@firebase/auth';

export default Base.extend({
    authorize(data, cb) {
        data.credential.then(token => {
            cb('Authorization', `Bearer ${token}`);
        });
    }
});