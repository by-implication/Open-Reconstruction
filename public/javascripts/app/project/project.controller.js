project.controller = function(){
  // var self = this;
  this.app = new app.controller();
  this.projectTabs = new common.tabs.controller();
  this.projectTabs.tabs([{label: "Images"}, {label: "Documents"}, {label: "Activity"}]);
  this.projectTabs.currentTab(this.projectTabs.tabs()[0].label)

  this.tabs = new common.tabs.controller();
  this.id = m.route.param("id");
  this.project = m.prop({});
  this.author = m.prop({});
  this.oldProject = m.prop({});
  this.location = m.prop("");

  function parseLocation(location){
    var split = location.split(',').map(function(coord){return parseFloat(coord)});
    if (_.contains(split, NaN) || (split.length % 2)) {
      // display as plain string
      return; 
    } else {
      // do leaflet stuff
    }
  }

  this.dropzone = null;

  m.request({method: "GET", url: "/requests/"+this.id+"/meta"}).then(function(data){
    this.project(data.request);
    this.author(data.author);
    parseLocation(data.request.location);
  }.bind(this));

  database.pull().then(function(data){
    this.oldProject(database.projectList()[this.id - 1]);
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
        dictDefaultMessage: "Drop photos here, or click to browse.",
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
        dictDefaultMessage: "Drop documents here, or click to browse. We recommend pdfs and doc files.",
        clickable: true,
        autoDiscover: false
      })
    }
  }.bind(this);
}