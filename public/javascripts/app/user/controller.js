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
  this.page = parseInt(m.route.param("page")) || 1;
  this.sort = m.route.param("sort") || "id";
  this.sortDir = m.route.param("sortDir") || "asc";

  this.sortBy = function(sort){
    var sortDir = (self.sortDir == "asc" && sort == self.sort) ? "desc" : "asc";
    return routes.controllers.Users.viewPage(self.id, self.page, sort, sortDir).url
  }

  this.page = parseInt(m.route.param("page")) || 1;
  this.requestCount = m.prop(0);
  this.pageLimit = m.prop(1);

  bi.ajax(routes.controllers.Users.viewMeta(self.id, self.page, self.sort, self.sortDir)).then(function (r){
    this.user(r.user)
    this.requestList(r.requests);
    this.requestCount(r.requestCount);
    this.pageLimit(r.pageLimit);
    this.filteredList = function(){
      return _.chain(this.requestList);
    }
  }.bind(this));
  
}