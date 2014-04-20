project.controller = function(){
  var self = this;
  var map;
  this.app = new app.controller();
  this.projectTabs = new common.tabs.controller();
  this.projectTabs.tabs([{label: "Assignments"}, {label: "Images"}, {label: "Documents"}, {label: "Activity"}]);
  this.projectTabs.currentTab(this.projectTabs.tabs()[0].label)

  this.tabs = new common.tabs.controller();
  this.id = m.route.param("id");
  this.project = m.prop({});
  this.author = m.prop({});
  this.oldProject = m.prop({});
  this.location = m.prop("");
  // this.coords = m.prop(null);
  
  this.assessingAgencies = m.prop([]);
  this.implementingAgencies = m.prop([]);

  function parseLocation(location){
    var split = location.split(',').map(function(coord){return parseFloat(coord)});
    if (_.contains(split, NaN) || (split.length % 2)) {
      // display as plain string
      return; 
    } else {
      var coords = new L.LatLng(split[0], split[1])
      window.setTimeout(function(){
        map.setView(coords, 8);
        L.marker(coords).addTo(map);
      }, 200) // I'M SO SORRY
    }
  }

  this.dropzone = null;

  m.request({method: "GET", url: "/requests/"+this.id+"/meta"}).then(function(data){
    this.project(data.request);
    this.author(data.author);
    this.assessingAgencies(data.assessingAgencies);
    this.implementingAgencies(data.implementingAgencies);
    parseLocation(data.request.location);
  }.bind(this));

  database.pull().then(function(data){
    this.oldProject(database.projectList()[this.id - 1]);
  }.bind(this))

  this.initMap = function(elem, isInit){
    if(!isInit){
      window.setTimeout(function(){
        map = L.map(elem, {scrollWheelZoom: false}).setView([11.3333, 123.0167], 5);
        // if(self.coords()){
        //   map.setView(self.coords, 8);
        // }
        // create the tile layer with correct attribution
        var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 19, attribution: osmAttrib}).addTo(map);   

        var editableLayers = new L.FeatureGroup();
        map.addLayer(editableLayers);

        // Initialise the draw control and pass it the FeatureGroup of editable layers
      }, 100) // I'M SO SORRY
    }
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