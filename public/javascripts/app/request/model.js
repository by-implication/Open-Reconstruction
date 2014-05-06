var request = {};

request.Request = function(data){
  for(prop in data){
    this[prop] = m.prop(data[prop]);
  }
}

request.List = Array;