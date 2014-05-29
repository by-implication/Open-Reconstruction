user.controller = function(){
  this.app = new app.controller();
  var self = this;
  this.id = m.route.param("id");
  this.user = m.prop({
    name: "",
    govUnit: {
      name: ""
    }
  });
  this.requestList = m.prop([]);
  this.currentFilter = {requests: function(){return null}};
  this.sortBy = m.prop("id");

  bi.ajax(routes.controllers.Users.viewMeta(self.id)).then(function (r){
    if(r.success){
      this.user(r.user)
      this.requestList(r.requests);
      this.filteredList = function(){
        return _.chain(this.requestList);
      }
    } else {
      alert(r.reason);
    }
  }.bind(this))
}