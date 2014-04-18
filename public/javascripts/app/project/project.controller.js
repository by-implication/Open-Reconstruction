project.controller = function(){
  // var self = this;
  this.app = new app.controller();
  this.projectTabs = new common.tabs.controller();
  this.tabs = new common.tabs.controller();
  this.id = m.route.param("id");
  this.project = m.prop({});
  database.pull().then(function(data){
    this.project(database.projectList()[this.id - 1]);
  }.bind(this))

  this.isCurrentUserAuthorized = function(){
    var userPermission = process.permissions()[this.app.currentUser().department];
    return _.contains(userPermission, this.project().progress());
  }
  this.initMap = function(elem, isInit){
    this.app.initMap(elem, isInit, {scrollWheelZoom: false});
  }.bind(this)

  this.initImageDropzone = function(elem, isInit){
    if(!isInit){
      var dropzone = new Dropzone(elem, {url: "/file/post"})
    }
  }

  this.initDocDropzone = function(elem, isInit){
    if(!isInit){
      var dropzone = new Dropzone(elem, {url: "/file/post"})
    }
  }
}