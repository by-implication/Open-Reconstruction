project.controller = function(){
  // var self = this;
  this.app = new app.controller();
  this.projectTabs = new common.tabs.controller();
  this.projectTabs.tabs([{label: "Images"}, {label: "Documents"}, {label: "Activity"}]);
  this.projectTabs.currentTab(this.projectTabs.tabs()[0].label)

  this.tabs = new common.tabs.controller();
  this.id = m.route.param("id");
  this.project = m.prop({});

  this.dropzone = null;

  database.pull().then(function(data){
    this.project(database.projectList()[this.id - 1]);
  }.bind(this))

  this.initMap = function(elem, isInit){
    this.app.initMap(elem, isInit, {scrollWheelZoom: false});
  }.bind(this)

  var dropzonePreviewTemplate = m(".dz-preview.dz-file-preview", [
    m(".dz-details", [
      m(".dz-filename", [
        m("span", {"data-dz-name": true}),
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

  this.initImageDropzone = function(elem, isInit){
    // this.dropzone = {};
    // console.log(isInit);
    if(!isInit){

      this.dropzone = new Dropzone(elem, {
        url: "/file/post", 
        previewTemplate: m.stringify(dropzonePreviewTemplate), 
        dictDefaultMessage: "Drop files here, or click to browse files.",
        clickable: true,
        autoDiscover: false
      })
    }
  }.bind(this);

  this.initDocDropzone = function(elem, isInit){
    // this.dropzone = {};
    // console.log(isInit);
    if(!isInit){

      this.dropzone = new Dropzone(elem, {
        url: "/file/post", 
        previewTemplate: m.stringify(dropzonePreviewTemplate), 
        dictDefaultMessage: "Drop files here, or click to browse files. Hi!",
        clickable: true,
        autoDiscover: false
      })
    }
  }.bind(this);
}