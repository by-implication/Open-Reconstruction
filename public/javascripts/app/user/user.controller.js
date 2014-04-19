user.controller = function(){
  this.app = new app.controller();
  var self = this;
  this.id = m.route.param("id");
  this.user = m.prop({});
  this.projectList = m.prop([]);
  this.currentFilter = {projects: function(){return null}};

  m.request({method: "GET", url: ("/users/" + this.id + "/meta"), config: app.xhrConfig}).then(function (r){
    if(r.success){
      self.user(r.user)
    } else {
      alert(r.reason);
    }
  })
}