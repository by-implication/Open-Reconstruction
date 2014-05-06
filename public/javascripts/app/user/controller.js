user.controller = function(){
  this.app = new app.controller();
  var self = this;
  this.id = m.route.param("id");
  this.user = m.prop({});
  this.projectList = m.prop([]);
  this.currentFilter = {projects: function(){return null}};
  this.currentSort = m.prop();

  bi.ajax(routes.controllers.Users.viewMeta(self.id)).then(function (r){
    if(r.success){
      this.user(r.user)
      this.projectList = r.requests;
      this.filteredList = function(){
        return _.chain(this.projectList);
      }
    } else {
      alert(r.reason);
    }
  }.bind(this))
}