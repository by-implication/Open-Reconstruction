bi = {

  ajax: function(route, options){ // accepts a resolved play route
    options = options || {};
    options.method = route.method;
    options.url = route.url;
    return m.request(options);
  }

}