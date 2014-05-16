app.controller = function(){
  var self = this;
  this.currentUser = m.prop({
    isSuperAdmin: "",
    govUnit: {
      acronym: "",
      id: "",
      name: "",
      role: ""
    }
  });

  bi.ajax(routes.controllers.Users.meta()).then(function (r){
    this.currentUser(r);
  }.bind(this));

  this.isAuthorized = function(permission){
    return this.currentUser() && _.contains(this.currentUser().permissions, permission);
  }

  this.isUserAuthorized = function(user, permission){
    return user && _.contains(user.permissions, permission);
  }

  this.isSuperAdmin = function(){
    return this.currentUser() && this.currentUser().isSuperAdmin;
  }

  this.isGovUnitAdmin = function(govUnitId){
    return this.isSuperAdmin() || this.currentUser() && this.currentUser().isAdmin && this.currentUser().govUnit.id === govUnitId;
  }

  this.getCurrentUserProp = function(prop){
    return this.currentUser() ? this.currentUser()[prop] : null
  }
  
  this.initMap = function(elem, isInit, config, isEditable){
    if(!isInit){
      window.setTimeout(function(){
        var map = L.map(elem, config).setView([11.3333, 123.0167], 5);

        // create the tile layer with correct attribution
        var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 19, attribution: osmAttrib}).addTo(map);   

        if(isEditable){
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
          });
        }
      }, 100)
    }
    
  };
  this.db = {};
  this.db.clear = function(){
    localStorage.clear();
  };
}