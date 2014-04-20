projectListing.controller = function(){
  var self = this;
  this.app = new app.controller();
  this.tabs = new common.tabs.controller();
  this.tabs.tabs = m.prop([
    {label: "All"},
    {label: "For signoff"},
    {label: "For assigning assessor"}
  ]);
  this.tabs.currentTab("For signoff");
  this.projectList = m.prop([]);
  this.projectFilters = m.prop([]);
  this.currentFilter = {
    projects: m.prop("")
  };

  // this.setCurrentTab = function(elem){
  //   if(_.contains(this.app.currentUser().permissions, 5)){
  //     this.tabs.currentTab("Assigned to Me");
  //   } else {
  //     this.tabs.currentTab("All");
  //   }
  // }.bind(this);

  m.request({method: "GET", url: "/requests"}).then(function (r){
    self.projectList = r.list;
    self.projectFilters = r.filters;
  });

}