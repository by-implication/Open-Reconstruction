userCreation.controller = function(){
  this.app = new app.controller();
  this.slug = m.prop(m.route.param("id"));
  this.govUnit = m.prop({});

  var ctrl = this;

  bi.ajax(routes.controllers.GovUnits.viewMeta(this.slug(), "users", 1)).then(function (r){
    this.govUnit(r.govUnit);
  }.bind(this));

  this.entries = [];

  this.submit = function(e){
    e.preventDefault();
    bi.ajax(routes.controllers.Users.insert(this.slug()), {data: {users: this.entries}}).then(function (r){
      m.route(routes.controllers.GovUnits.view(this.slug()).url);
    }.bind(this), common.formErrorHandler);
  }.bind(this)

  this.newEntry = function(){
    ctrl.entries.push({
      name: m.prop(""),
      handle: m.prop(""),
      password: m.prop(""),
      isAdmin: m.prop(false),
      remove: function(){ ctrl.removeEntry(this); }
    });
  }

  this.newEntry();

  this.removeEntry = function (e){
    ctrl.entries.splice(ctrl.entries.splice.indexOf(e), 1);
  }
}