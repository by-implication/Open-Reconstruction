userCreation.controller = function(){
  this.app = new app.controller();
  this.slug = m.prop(m.route.param("id"));
  this.govUnit = m.prop({});
  this.input = {
    name: m.prop(""),
    handle: m.prop(""),
    password: m.prop(""),
    govUnitId: m.prop(0),
    isAdmin: m.prop(false)
  }

  bi.ajax(routes.controllers.GovUnits.viewMeta(this.slug(), 1)).then(function (r){
    this.govUnit(r.govUnit);
    this.input.govUnitId(r.govUnit.id);
  }.bind(this));

  this.submit = function(e){
    e.preventDefault();
    bi.ajax(routes.controllers.Users.insert(this.slug()), {data: this.input}).then(function (r){
      m.route(routes.controllers.GovUnits.view(this.slug()).url);
    }.bind(this), common.formErrorHandler);
  }.bind(this)

  this.newEntry = function(){
    console.log("Adding new user.");
  }
}