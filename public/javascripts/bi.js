var bi = {
  loader: {
    pending: 0,
    initialized: false,
    init: function(element, isInitialized) {
      bi.loader.initialized = true;
    },
    increment: function() {
      if(bi.loader.initialized) {
        // show loading animation
      }
      bi.loader.pending++;
    },
    decrement: function(value) {
      bi.loader.pending--;
      if(bi.loader.pending == 0 && bi.loader.initialized) {
        // hide loading animation
      }
      return value;
    }
  },

  ajax: function(route, options){ // accepts a resolved play route
    var updateLoader = bi.loader.decrement;
    bi.loader.increment();

    options = options || {};
    options.method = options.method || route.method;
    options.url = options.url || route.url;
    options.config = options.config || options.data ? function (xhr){
      xhr.setRequestHeader("Content-Type", "application/json");
    } : null;
    return m.request(options).then(updateLoader, updateLoader);
  },

  controller: function(module, deps, ctrl){
    var args = deps.map(function(d){
      return window[d];
    });
    window[module].controller = ctrl.bind.apply(ctrl, [null].concat(args)); // returns a new constructor function with the args bound
  }
}