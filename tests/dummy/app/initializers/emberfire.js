export function initialize() {
    if (XMLHttpRequest === undefined) {
      // Set a "global variable" called town
      global['XMLHttpRequest'] = 'ffffuck';
    }
  };
  
  export default {
    name: 'emberfire',
    initialize: initialize
  };