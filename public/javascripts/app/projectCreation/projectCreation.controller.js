projectCreation.controller = function(){
  var self = this;
  this.app = new app.controller();
  
  this.input = {
    amount: m.prop(0),
    attachments: m.prop([]),
    date: m.prop(""),
    description: m.prop(""),
    disasterDate: m.prop("1/1/2001"),
    disasterName: m.prop(""),
    disasterType: m.prop(""),
    location: m.prop(""),
    projectType: m.prop("Road"),
    scopeOfWork: m.prop("Reconstruction")
  }

  this.initMap = function(elem, isInit){
    // this.app.initMap(elem, isInit, {scrollWheelZoom: false}, true);

    if(!isInit){
      window.setTimeout(function(){
        var map = L.map(elem, {scrollWheelZoom: false}).setView([11.3333, 123.0167], 5);

        // create the tile layer with correct attribution
        var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 19, attribution: osmAttrib}).addTo(map);   

        var editableLayers = new L.FeatureGroup();
        map.addLayer(editableLayers);

        // Initialise the draw control and pass it the FeatureGroup of editable layers
        var drawControl = new L.Control.Draw({
          edit: {
            featureGroup: editableLayers,
            edit: false,
            remove: false
          },
          draw: {
            polyline: false,
            polygon: false,
            rectangle: false,
            circle: false
          },
          // position: 'topright' 
        });
        map.addControl(drawControl);

        map.on('draw:created', function (e) {
          var type = e.layerType,
            layer = e.layer;

          editableLayers.clearLayers();
          editableLayers.addLayer(layer);

          // console.log(layer);
          self.input.location(layer._latlng);
        });
      }, 100)
    }

  }.bind(this);

  m.request({method: "GET", url: "/requests/info"}).then(function(data){
    this.requestCreationInfo = data;
  }.bind(this));

  this.disasterDate = [1, 1, 2001];
  this.updateDateField = function(e){
    var i = ["disaster-month", "disaster-day", "disaster-year"].indexOf(e.srcElement.id);
    this.disasterDate[i] = e.srcElement.value;
    this.input.disasterDate(this.disasterDate.join("/"));
  }.bind(this);

  this.submitNewRequest = function(e){
    e.preventDefault();
    m.request({method: "POST", url: "/requests/new", data: this.input, config: app.xhrConfig}).then(function(r){
      if(r.success){
        window.location = '/';
      } else if(r.reason == "form error"){
        alert("Request not created!");
      } else {
        alert(r.reason);
      }
    })
  }.bind(this);
}
