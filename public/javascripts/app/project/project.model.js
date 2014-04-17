var project = {};

project.Project = function(data){
  for(prop in data){
    this[prop] = m.prop(data[prop]);
  }
}

project.List = Array;