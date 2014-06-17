govUnit.controller = function(){
  this.app = new app.controller();
  this.id = m.route.param("id");
  this.page = parseInt(m.route.param("page")) || 1;
  var self = this;
  this.govUnit = m.prop({
    id: -1,
    name: "My Agency",
    acronym: "",
    role: ""
  });
  this.users = m.prop([]);
  this.requests = m.prop([]);
  this.totalReqs = m.prop(0);
  this.maxPage = function(){
    var count = parseInt(this.totalReqs()) || 0;
    return Math.ceil(count / 20);
  };
  this.children = m.prop([]);

  bi.ajax(routes.controllers.GovUnits.viewMeta(this.id, this.page)).then(function (r){
    self.govUnit(r.govUnit);
    self.users(r.users);
    self.requests(r.requests);
    self.totalReqs(r.totalReqs);
    if(r.lgu){
      self.children(r.lgu.children);
    }
  }, function (r){    
    if(r.reason == "form error"){
      alert("Agency not created!");
    } else {
      alert(r.reason);
    }
  })
}