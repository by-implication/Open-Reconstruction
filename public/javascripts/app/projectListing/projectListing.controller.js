projectListing.controller = function(){
  var self = this;
  // this.Users = new user.controller();
  // this.Projects = new project.controller();
  this.app = new app.controller();
  this.tabs = new common.tabs.controller();
  this.projectList = m.prop([]);
  this.projectFilters = m.prop([]);
  this.currentFilter = {
    projects: m.prop("")
  };

  database.pull().then(function(data){
    // don't use data because you don't want to override new projects. this has already been used in database.pull
    self.projectList = database.projectList;
    self.projectFilters = database.projectFilters;
  });
}