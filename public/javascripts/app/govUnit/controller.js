govUnit.controller = function(){
  this.app = new app.controller();
  this.slug = m.prop(m.route.param("id"));
  var self = this;
  this.govUnit = m.prop({
    id: -1,
    name: "My Agency",
    acronym: "",
    role: ""
  });
  this.users = m.prop([]);

  bi.ajax(routes.controllers.GovUnits.viewMeta(this.slug())).then(function (r){
    self.govUnit(r.govUnit)
    self.users(r.users)
  }, function (r){    
    if(r.reason == "form error"){
      alert("Agency not created!");
    } else {
      alert(r.reason);
    }
  })
}