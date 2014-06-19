requestCreation.controller = function(){
  var self = this;
  this.app = new app.controller();
  this.info = new m.prop({
    disasterTypes: [],
    projectTypes: [],
    projectScopes: []
  });

  this.preamble = m.prop(false);
  this.input = {
    amount: m.prop(0),
    attachments: m.prop([]),
    date: m.prop(""),
    description: m.prop(""),
    disasterDate: m.prop("2001-1-1"),
    disasterName: m.prop(""),
    disasterTypeId: m.prop(1),
    location: m.prop(""),
    projectTypeId: m.prop(1),
    scopeOfWork: m.prop("Reconstruction")
  }

  this.submitButtonDisabled = m.prop(false);

  this.attachments = m.prop({
    imgs: [],
    docs: []
  })

  this.initImageDropzone = function(elem, isInit){
    if(!isInit){

      var dz = new Dropzone(elem, {
        url: routes.controllers.Attachments.addToBucket(this.input.bucketKey, "img").url,
        previewTemplate: m.stringify(common.dropzonePreviewTemplate), 
        dictDefaultMessage: "Drop photos here, or click to browse.",
        clickable: true,
        autoDiscover: false,
        thumbnailWidth: 128,
        thumbnailHeight: 128,
        acceptedFiles: "image/*"
      })

      dz.on("success", function (_, r){
        this.attachments().imgs.push(r);
        m.redraw();
      }.bind(this));

    }
  }.bind(this);

  this.initDocDropzone = function(elem, isInit){
    if(!isInit){

      var dz = new Dropzone(elem, {
        url: routes.controllers.Attachments.addToBucket(this.input.bucketKey, "doc").url,
        previewTemplate: m.stringify(common.dropzonePreviewTemplate), 
        dictDefaultMessage: "Drop documents here, or click to browse. We recommend pdfs and doc files.",
        clickable: true,
        autoDiscover: false
      });

      dz.on("success", function (_, r){
        this.attachments().docs.push(r);
        m.redraw();
      }.bind(this));

    }
  }.bind(this);

  // this.configShowForm = function(elem){
  //   window.setTimeout(function(){
  //     elem.classList.add("expand");
  //   }, 0)
  // }

  this.initMap = function(elem, isInit){

    if(!isInit){
      window.setTimeout(function(){
        var map = common.leaflet.map(elem);

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
          var coords = layer._latlng
          var strCoords = coords.lat+","+coords.lng

          layer.bindPopup("<h5>Location Saved!</h5>Your coordinates are<br/>" + strCoords);
          editableLayers.clearLayers();
          editableLayers.addLayer(layer);
          editableLayers.openPopup();

          self.input.location(strCoords);
        });
      }, 100)
    }

  }.bind(this);

  bi.ajax(routes.controllers.Requests.createMeta()).then(function (data){
    this.info(data);
    this.input.disasterTypeId(data.disasterTypes[0].id);
    this.input.bucketKey = data.bucketKey;
  }.bind(this));

  this.disasterDate = [2001, 1, 1];
  this.updateDateField = function(e){
    var i = ["disaster-year", "disaster-month", "disaster-day"].indexOf(e.srcElement.id);
    this.disasterDate[i] = e.srcElement.value;
    this.input.disasterDate(this.disasterDate.join("-"));
  }.bind(this);

  this.submitNewRequest = function(e){;
    e.preventDefault();
    if(this.preamble()) {

      // transmit disasterDate as a timestamp
      var oldDate = this.input.disasterDate();
      var newDate = (new Date(oldDate)).getTime();
      this.input.disasterDate(newDate);

      bi.ajax(routes.controllers.Requests.insert(), {data: this.input}).then(function (r){
        m.route(routes.controllers.Requests.view(r.id).url);
      }, function (r){
        if(r.reason == "form error"){
          var msg = "Request not created because of the following:";
          for(var field in r.messages){
            var message = r.messages[field];
            msg += "\n" + field + " - " + message;
          }
          alert(msg);
        } else {
          alert(r.reason);
        }
        this.submitButtonDisabled(false);
      });
      
    } else {
      alert('To avoid double-budgeting, please make sure to request for assistance only once!');
    }
  }.bind(this);
}
