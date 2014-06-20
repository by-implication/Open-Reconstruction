var bi = {
  
  loader: {
    pending: 0,
    initialized: false,
    init: function(element, isInitialized) {
      bi.loader.initialized = true;
    },
    increment: function() {
      if(bi.loader.initialized) {
        NProgress.start();
      }
      bi.loader.pending++;
    },
    decrement: function(value) {
      bi.loader.pending--;
      if(bi.loader.pending == 0 && bi.loader.initialized) {
        NProgress.done();
      }
      return value;
    }
  },

  ajax: function(route, options){ // can accept a resolved play route
    var updateLoader = bi.loader.decrement;
    bi.loader.increment();
    options = options || {};
    options.method = options.method || route.method || "GET";
    options.url = options.url || route.url || route;
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