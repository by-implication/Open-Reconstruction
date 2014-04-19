app.controller = function(){
  var self = this;
  this.currentUser = m.prop({});
  m.request({
    method: "GET",
    url: "/users/info"
  }).then(function(r){
    this.currentUser(r);
  }.bind(this));

  this.isAuthorized = function(permission){
    return this.currentUser() && _.contains(this.currentUser().permissions, permission);
  }

  this.isSuperAdmin = function(){
    return this.currentUser() && this.currentUser().isSuperAdmin;
  }

  this.isAgencyAdmin = function(agencyId){
    return this.isSuperAdmin() || this.currentUser() && this.currentUser().isAdmin && this.currentUser().agency.id === agencyId;
  }
  
  this.initMap = function(elem, isInit, config){
    if(!isInit){
      window.setTimeout(function(){
        var map = L.map(elem, config).setView([11.3333, 123.0167], 5);

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
            edit: false
          },
          draw: {
            polyline: false,
            polygon: false,
            rectangle: false,
            circle: false
          }
            
        });
        map.addControl(drawControl);

        map.on('draw:created', function (e) {
          var type = e.layerType,
            layer = e.layer;

          if (type === 'marker') {
            // marker = L.marker(layer._latlng).addTo(map);
            // marker.bindPopup("A popup!").openPopup();
          }
          // if (type === 'rectangle'){
          //   rect = L.rectangle(layer._latlng).addTo(map);
          // }

          if(type === 'circle') {
            // circle = L.circle(layer._latlng, layer._mRadius).addTo(map);
            // circle.bindPopup("A circle!");
          }
          editableLayers.clearLayers();
          editableLayers.addLayer(layer);
        });
      }, 100)
    }
    
  };
  this.db = {};
  this.db.clear = function(){
    localStorage.clear();
  };
}