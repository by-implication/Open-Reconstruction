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
  this.attachments = m.prop({});
  this.oldProject = m.prop({});
  this.location = m.prop("");
  this.canSignoff = m.prop(false);
  this.input = {
    assessingAgency: m.prop(),
    implementingAgency: m.prop()
  };
  this.assessingAgency = m.prop();
  this.implementingAgency = m.prop();
  
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
    this.attachments(data.attachments);
    this.assessingAgencies(data.assessingAgencies);
    this.implementingAgencies(data.implementingAgencies);
    this.assessingAgency(data.assessingAgency);
    this.implementingAgency(data.implementingAgency);

    this.input.assessingAgency(data.request.assessingAgencyId);
    this.input.implementingAgency(data.request.implementingAgencyId);  

    this.canSignoff(data.canSignoff);
    parseLocation(data.request.location);
  }.bind(this));

  database.pull().then(function(data){
    this.oldProject(database.projectList()[this.id - 1]);
  }.bind(this))

  this.signoff = function(){
    m.request({method: "POST", url: "/requests/"+this.id+"/signoff"}).then(function(data){
      alert('Signoff successful! Replace this message with something more useful.');
    }.bind(this));
  }.bind(this);

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

  this.updateAssessingAgency = function(e){
    this.input.assessingAgency(e);
    m.request({method: "POST", url: "/requests/" + this.id + "/assign/assessing/" + this.input.assessingAgency()}).then(function(r){
      console.log('Assessing agency submitted!');
    })
  }.bind(this);

  this.updateImplementingAgency = function(e){
    this.input.implementingAgency(e);
    m.request({method: "POST", url: "/requests/" + this.id + "/assign/implementing/" + this.input.implementingAgency()}).then(function(r){
      console.log('Implementing agency submitted!');
    })
  }.bind(this);

  var dropzonePreviewTemplate = m(".dz-preview.dz-file-preview", [
    m(".dz-details", [
      m("img", {"data-dz-thumbnail": true}),
      m(".dz-filename", [
        m("span", {"data-dz-name": true}),
      ]),
      m(".dz-size", {"data-dz-size": true}),
    ]),
    m(".dz-progress", [
      m("span.dz-upload", {"data-dz-uploadprogress": true}),
    ]),
    // m(".dz-success-mark", [
    //   m("i.fa.fa-check"),
    // ]),
    // m(".dz-error-mark", [
    //   m("i.fa.fa-times")
    // ]),
    m(".dz-error-message", [
      m("span", {"data-dz-errormessage": true})
    ]),
  ]);

  this.initImageDropzone = function(elem, isInit){
    if(!isInit){

      this.dropzone = new Dropzone(elem, {
        url: "/requests/" + this.id + "/attach",
        previewTemplate: m.stringify(dropzonePreviewTemplate), 
        dictDefaultMessage: "Drop photos here, or click to browse.",
        clickable: true,
        autoDiscover: false,
        thumbnailWidth: 128,
        thumbnailHeight: 128
      })
    }
  }.bind(this);

  this.initDocDropzone = function(elem, isInit){
    if(!isInit){

      this.dropzone = new Dropzone(elem, {
        url: "/requests/" + this.id + "/attach",
        previewTemplate: m.stringify(dropzonePreviewTemplate), 
        dictDefaultMessage: "Drop documents here, or click to browse. We recommend pdfs and doc files.",
        clickable: true,
        autoDiscover: false
      });

      this.dropzone.on("success", function (_, r){
        this.attachments().push(r.attachment);
        m.redraw();
      }.bind(this));

    }
  }.bind(this);
}