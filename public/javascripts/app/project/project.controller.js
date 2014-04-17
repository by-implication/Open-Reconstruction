project.controller = function(){
  var self = this;
  this.app = new app.controller();
  this.projectTabs = new common.tabs.controller();
  this.tabs = new common.tabs.controller();
  this.id = m.route.param("id");
  this.project = m.prop({});
  database.pull().then(function(data){
    self.project(database.projectList()[self.id - 1]);
  })

  this.isCurrentUserAuthorized = function(){
    var userPermission = process.permissions()[this.app.currentUser().department];
    return _.contains(userPermission, this.project().progress());
  }


  this.initMap = function(elem, isInit){
    this.app.initMap(elem, isInit, {scrollWheelZoom: false});
  }.bind(this)
}