var agency = {}

agency.Agency = function(data){
  for(prop in data){
    this[prop] = m.prop(data[prop]);
  }
  this.slug = m.prop(this.name().replace(/ /g, "-").replace(/\./g, "").toLowerCase());
}