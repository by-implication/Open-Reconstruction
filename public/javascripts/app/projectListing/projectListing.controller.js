projectListing.controller = function(){
  var self = this;
  this.app = new app.controller();
  this.tabs = new common.tabs.controller();
  this.tabs.tabs = m.prop([
    {label: "All"},
    {label: "Assigned to Me"}
  ]);
  this.projectList = m.prop([]);
  this.projectFilters = m.prop([]);
  this.currentFilter = {
    projects: m.prop("")
  };

  m.request({method: "GET", url: "/requests"}).then(function (r){
    self.projectList = r.list;
    self.projectFilters = r.filters;
  });

}