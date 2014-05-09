var bi = {

  ajax: function(route, options){ // accepts a resolved play route
    options = options || {};
    options.method = options.method || route.method;
    options.url = options.url || route.url;
    options.config = options.config || options.data ? function (xhr){
      xhr.setRequestHeader("Content-Type", "application/json");
    } : null;
    return m.request(options);
  },

  controller: function(module, deps, ctrl){
    var args = deps.map(function(d){
      return window[d];
    });
    window[module].controller = ctrl.bind.apply(ctrl, [null].concat(args)); // returns a new constructor function with the args bound
  }
}