var request = {
	disasterTypes: m.prop([])
};

request.Request = function(data){
  for(prop in data){
    this[prop] = m.prop(data[prop]);
  }
}

request.List = Array;