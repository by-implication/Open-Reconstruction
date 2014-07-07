requestCreation.controller = function(){
  var ctrl = this;
  this.app = new app.controller();
  this.info = new m.prop({
    projectTypes: [],
    projectScopes: [],
    disasters: []
  });

  this.requirementLevel = m.prop("Submission");

  this.locModal = new common.modal.controller();
  this.attModal = new common.modal.controller();

  this.preamble = m.prop(false);
  this.disasterId = m.prop(1),
  this.entries = [];
  this.newEntry = function(bucketKey){
    if(typeof bucketKey == "string"){
      ctrl.entries.push({
        description: m.prop(""),
        amount: m.prop(0),
        projectTypeId: m.prop(1),
        location: m.prop(""),
        attachments: m.prop([]),
        bucketKey: bucketKey,
        remove: function(){ ctrl.removeEntry(this); },
        openLocationModal: function(e){
          ctrl.locModal.show();
        },
        openAttachmentsModal: function(e){
          ctrl.attModal.show();
        }
      });
    } else {
      bi.ajax(routes.controllers.Attachments.getNewBucketKey()).then(function (r){
        ctrl.newEntry(r.bucketKey);
      })
    }
  }
  this.removeEntry = function (e){
    this.entries.splice(this.entries.indexOf(e), 1);
  }

  this.submitButtonDisabled = m.prop(false);

  this.requirements = m.prop([]);
  this.attachments = m.prop([]);

  this.initAttachmentDropzone = function(reqt){
    return function(elem, isInit){
      if(!isInit){

        var dz = new Dropzone(elem, {
          url: routes.controllers.Attachments.addToBucket(ctrl.input.bucketKey, reqt.id).url,
          previewTemplate: m.stringify(common.dropzonePreviewTemplate),
          dictDefaultMessage: "Drop photos here, or click to browse.",
          clickable: true,
          autoDiscover: false,
          thumbnailWidth: 128,
          thumbnailHeight: 128,
          acceptedFiles: reqt.isImage ? "image/*" : ""
        })

        dz.on("success", function (_, r){
          ctrl.attachments().push(r);
          m.redraw();
        }.bind(this));

      }
    }
  }

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

          ctrl.input.location(strCoords);
        });
      }, 100)
    }

  }.bind(this);

  bi.ajax(routes.controllers.Requests.createMeta()).then(function (data){
    ctrl.info(data);
    ctrl.requirements(common.processReqts(data.requirements));
    ctrl.newEntry(data.bucketKey);
  });

  this.submitNewRequest = function(e){
    e.preventDefault();
    if(this.preamble()) {

      bi.ajax(routes.controllers.Requests.insert(), {data: this.input}).then(function (r){
        m.route(routes.controllers.Requests.view(r.id).url);
      }, function (r){
        common.formErrorHandler(r);
        this.submitButtonDisabled(false);
      });
      
    } else {
      alert('To avoid double-budgeting, please make sure to request for assistance only once!');
    }
  }.bind(this);

  this.attachmentFor = common.attachmentFor;

}
