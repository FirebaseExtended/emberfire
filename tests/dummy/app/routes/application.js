import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    return this.get('session').fetch()
      .catch(() => undefined); // ignore empty sessions
  },
  actions: {
    signIn(provider, emailOrToken, password) {
      let authPromise;
      if (provider === 'password') {
        authPromise = this.get('session').open('firebase', {
          provider: provider,
          email: emailOrToken,
          password: password
        });
      } else if (provider === 'custom') {
        authPromise = this.get('session').open('firebase', {
          provider: provider,
          token: emailOrToken
        });
      } else {
        authPromise = this.get('session').open('firebase', { provider: provider });
      }

      authPromise.then(result => console.log('session.open result:', result))
        .catch(err => console.warn('session.open error:', err));
    },
    signOut() {
      this.get('session').close();
    }
  }
});
