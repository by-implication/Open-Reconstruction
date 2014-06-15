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
  this.page = parseInt(m.route.param("page")) || 1;
  this.requestCount = m.prop();
  this.maxPage = function(){
    var count = parseInt(this.requestCount()) || 0;
    return Math.ceil(count / 20);
  };

  bi.ajax(routes.controllers.Users.viewMeta(self.id, self.page)).then(function (r){
    this.user(r.user)
    this.requestList(r.requests);
    this.requestCount(r.requestCount);
    this.filteredList = function(){
      return _.chain(this.requestList);
    }
  }.bind(this), function (r){    
    alert(r.reason);
  })
}