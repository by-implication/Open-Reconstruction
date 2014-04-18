agency.controller = function(){
  var self = this;
  this.app = new app.controller();
  this.slug = m.prop(m.route.param("id"));
  this.agency = m.prop({
    id: -1,
    name: "My Agency",
    acronym: "",
    role: ""
  });

  m.request({method: "GET", url: ("/agencies/" + this.slug() + "/meta"), config: app.xhrConfig}).then(function (r){
    if(r.success){
      self.agency(r.agency)
    } else if(r.reason == "form error"){
      alert("Agency not created!");
    } else {
      alert(r.reason);
    }
  })
}