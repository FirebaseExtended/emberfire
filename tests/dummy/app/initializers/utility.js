export function initialize(app) {
  // Util
  ['controller', 'component'].forEach(function(type) {
    app.inject(type, 'util', 'utility:main');
  });

  // Store
  ['component', 'utility:main'].forEach(function(type) {
    app.inject(type, 'store', 'service:store');
  });
}

export default {
  name: 'utility',
  initialize: initialize
};
