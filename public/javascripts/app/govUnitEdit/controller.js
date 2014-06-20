govUnitEdit.controller = function(){

  this.app = new app.controller();

  this.id = m.route.param("id");
  this.input = {
    name: m.prop(""),
    acronym: m.prop(""),
    roleId: m.prop("")
  };
  this.role = m.prop("");
  this.govUnitType = m.prop("");
  this.roles = m.prop([]);

  this.submit = function(e){
    e.preventDefault();
    bi.ajax(routes.controllers.GovUnits.update(this.id), {data: this.input}).then(function (r){
      m.route(routes.controllers.GovUnits.view(this.id).url);
    }.bind(this), common.formErrorHandler);
  }.bind(this);

  this.cancel = function(){
    m.route(routes.controllers.GovUnits.view(this.id).url);
  }.bind(this);

  bi.ajax(routes.controllers.GovUnits.editMeta(this.id)).then(function (r){
    this.input.name(r.govUnit.name);
    this.input.acronym(r.govUnit.acronym);
    this.input.roleId(r.govUnit.roleId);
    this.role(r.govUnit.role);
    this.govUnitType(r.govUnit.role == "LGU" ? "LGU" : "Agency");
    this.roles(r.roles);
  }.bind(this));
  
}
