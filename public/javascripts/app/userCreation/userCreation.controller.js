userCreation.controller = function(){
  this.app = new app.controller();
  this.slug = m.prop(m.route.param("id"));
  this.agency = m.prop({})
  
  m.request({method: "GET", url: ("/agencies/" + this.slug() + "/meta"), config: app.xhrConfig}).then(function (r){
    if(r.success){
      this.agency(r.agency)
    } else {
      alert(r.reason);
    }
  }.bind(this));
}