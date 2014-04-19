userCreation.controller = function(){
  this.app = new app.controller();
  this.slug = m.prop(m.route.param("id"));
  this.agency = m.prop({});
  this.input = {
    handle: m.prop(""),
    password: m.prop(""),
    agencyId: m.prop(0),
    isAdmin: m.prop(false)
  }
  
  m.request({method: "GET", url: ("/agencies/" + this.slug() + "/meta"), config: app.xhrConfig}).then(function (r){
    if(r.success){
      this.agency(r.agency);
      this.input.agencyId(agency.id);
    } else {
      alert(r.reason);
    }
  }.bind(this));

  this.submit = function(e){
    e.preventDefault();
    console.log(this.input);
    m.request({method: "POST", url: "/users/new", data: this.input, config: app.xhrConfig}).then(function (r){
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