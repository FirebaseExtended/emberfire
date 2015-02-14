import Utility from 'dummy/utils/utility';
import FirebaseAdapter from 'emberfire/adapters/firebase';
import FirebaseSerializer from 'emberfire/serializers/firebase';

export default {
  name: 'utility',
  initialize: function (container, app) {
    container.register('utility:main', Utility, { singleton: true, instantiate: true });

    // Util
    ['controller', 'route', 'component', 'adapter', 'transform', 'model', 'serializer'].forEach(function(type) {
      app.inject(type, 'util', 'utility:main');
    });

    // Store
    ['component', 'utility:main'].forEach(function(type) {
      app.inject(type, 'store', 'store:main');
    });
  }
};
