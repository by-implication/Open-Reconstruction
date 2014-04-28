user.controller = function(){
  this.app = new app.controller();
  var self = this;
  this.id = m.route.param("id");
  this.user = m.prop({});
  this.projectList = m.prop([]);
  this.currentFilter = {projects: function(){return null}};

  m.request({method: "GET", url: ("/users/" + self.id + "/meta"), config: app.xhrConfig}).then(function (r){
    if(r.success){
      this.user(r.user)
      this.projectList = r.requests;
      this.filteredList = _.chain(this.projectList);
    } else {
      alert(r.reason);
    }
  }.bind(this))
}