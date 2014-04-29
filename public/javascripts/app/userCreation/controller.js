userCreation.controller = function(){
  this.app = new app.controller();
  this.slug = m.prop(m.route.param("id"));
  this.agency = m.prop({});
  this.input = {
    name: m.prop(""),
    handle: m.prop(""),
    password: m.prop(""),
    agencyId: m.prop(0),
    isAdmin: m.prop(false)
  }

  bi.ajax(routes.controllers.GovUnits.viewMeta(this.slug())).then(function (r){
    if(r.success){
      this.agency(r.agency);
      this.input.agencyId(r.agency.id);
    } else {
      alert(r.reason);
    }
  }.bind(this))

  this.submit = function(e){
    e.preventDefault();
    bi.ajax(routes.controllers.Users.insert(this.slug()), {data: this.input}).then(function (r){
      if(r.success){
        window.location = '/';
      } else if(r.reason == "form error"){
        alert("User not created!");
      } else {
        alert(r.reason);
      }
    });
  }.bind(this)
}