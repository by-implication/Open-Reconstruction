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

  this.initMap = function(elem, isInit){
    this.app.initMap(elem, isInit, {scrollWheelZoom: false});
  }.bind(this)

  this.initImageDropzone = function(elem, isInit){
    var pt = m(".dz-preview.dz-file-preview", [
      m(".dz-details", [
        m(".dz-filename", [
          m("span", {"data-dz-name": true}, "hi"),
        ]),
        m(".dz-size", {"data-dz-size": true}),
        m("img", {"data-dz-thumbnail": true}),
      ]),
      m(".dz-progress", [
        m("span.dz-upload", {"data-dz-uploadprogress": true}),
      ]),
      m(".dz-success-mark", [
        m("i.fa.fa-check"),
      ]),
      m(".dz-error-mark", [
        m("i.fa.fa-times")
      ]),
      m(".dz-error-message", [
        m("span", {"data-dz-errormessage": true})
      ]),
    ]);

    if(!isInit){
      var dropzone = new Dropzone(elem, {url: "/file/post", previewTemplate: m.stringify(pt)})

    }
  }

  this.initDocDropzone = function(elem, isInit){
    if(!isInit){
      var dropzone = new Dropzone(elem, {url: "/file/post"})
    }
  }
}