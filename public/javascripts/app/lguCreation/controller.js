lguCreation.controller = function(){
  
  this.app = new app.controller();

  this.input = {
    name: m.prop(""),
    acronym: m.prop("")
  }

  this.level = parseInt(m.route.param("level"));
  this.parentId = m.route.param("parentId");
  this.parentName = m.prop("");
  this.lguType = m.prop("");

  switch(this.level){
    case 0: this.lguType("Province"); break;
    case 1: this.lguType("City / Municipality"); break;
    case 2: this.lguType("Barangay"); break;
  }

  bi.ajax(routes.controllers.GovUnits.createLguMeta(this.level, this.parentId)).then(function (r){
    this.parentName(r.parentName);
  }.bind(this));

  this.submit = function(e){
    e.preventDefault();
    bi.ajax(routes.controllers.GovUnits.insertLgu(this.level, this.parentId), {data: this.input}).then(function (r){
      m.route(routes.controllers.Application.adminLgus().url);
    }, common.formErrorHandler)
  }.bind(this)
  
}