var request = {
	disasterTypes: m.prop([]),
	getDTbyId: function(id){
		return request.disasterTypes().filter(function (dt){
      return dt.id == id;
    })[0];
	}
};

request.Request = function(data){
  for(prop in data){
    this[prop] = m.prop(data[prop]);
  }
}

request.List = Array;