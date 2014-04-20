projectListing.controller = function(){
  var self = this;
  this.app = new app.controller();
  this.tabs = new common.tabs.controller('/projects');
  this.tabs.tabs = m.prop([
    {label: "All", href: 'all'},
    {label: "Assigned to Me", href: 'mine'}
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