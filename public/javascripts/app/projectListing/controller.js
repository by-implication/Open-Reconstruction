projectListing.controller = function(){
  var self = this;
  this.app = new app.controller();
  this.tabs = new common.tabs.controller("/projects");
  this.tabs.tabs = m.prop([
    {label: "All", href: "all"},
    {label: "For signoff", when: function(){
      return self.app.currentUser() && _.contains(self.app.currentUser().permissions, 5);
    }, href: "signoff"},
    {label: "For assigning assessor", when: function(){
      return self.app.isSuperAdmin();
    }, href: "assessor"},
    {label: "My requests", when: function(){
      return self.app.currentUser() && _.contains(self.app.currentUser().permissions, 1);
    }, href: "mine"}
  ]);
  // this.tabs.currentTab("For signoff");
  this.projectList = m.prop([]);
  this.projectFilters = m.prop([]);
  this.currentFilter = {
    projects: m.prop("")
  };

  // not sure if should
  this.app.whenUserInfoLoads = function(){
    // can't use config for when tabs loads because user data is asynchronous.

    if(this.app.isSuperAdmin()){
      this.tabs.currentTab("For assigning assessor");
    } else if(this.app.currentUser() && _.contains(this.app.currentUser().permissions, 5)){
      this.tabs.currentTab("For signoff");
    } else if(this.app.currentUser() && _.contains(this.app.currentUser().permissions, 1)){
      this.tabs.currentTab("My requests");
    } else {
      this.tabs.currentTab("All");
    }
  }.bind(this)

  m.request({method: "GET", url: "/requests"}).then(function (r){
    self.projectList = r.list;
    self.projectFilters = r.filters;
  });

}