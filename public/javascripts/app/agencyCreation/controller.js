agencyCreation.controller = function(){
  this.app = new app.controller();

  var self = this;

  this.roles = m.prop([{id: 0, name: 'Loading...'}]);

  bi.ajax(routes.controllers.GovUnits.createAgencyMeta()).then(function (r){
    self.roles(r.roles);
  }, function (r){
    alert(r.reason);
  });

  this.input = {
    name: m.prop(""),
    acronym: m.prop(""),
    roleId: m.prop(this.roles()[0].id)
  }
  
  this.submit = function(e){
    e.preventDefault();
    bi.ajax(routes.controllers.GovUnits.insertAgency(), {data: self.input}).then(function (r){
      window.location = '/';
    }, function (r){      
      if(r.reason == "form error"){
        alert("Agency not created!");
      } else {
        alert(r.reason);
      }
    })
  }
}