requestCreation.controller = function(){
  var ctrl = this;

  this.cancel = function(){ history.back(); }
  this.app = new app.controller();
  this.info = new m.prop({
    projectTypes: [],
    projectScopes: [],
    disasters: []
  });

  this.govUnit = m.prop();
  this.requirementLevel = m.prop("Submission");
  this.activeEntry = m.prop();
  this.requirements = m.prop();

  this.locModal = new common.modal.controller({
    initMap: function(elem, isInit){
      if(!isInit){
        window.setTimeout(function(){
          var map = common.leaflet.map(elem);
          common.leaflet.addDrawControls(function (e, editableLayers){

            var layer = e.layer;
            var coords = layer._latlng
            var strCoords = coords.lat+","+coords.lng

            ctrl.activeEntry().location(strCoords);

            layer.bindPopup("<h5>Location Saved!</h5>Your coordinates are<br/>" + strCoords);
            editableLayers.clearLayers();
            common.leaflet.clearMarkers();
            editableLayers.addLayer(layer);
            editableLayers.openPopup();

          });
        }, 100);
      }
    },
    setLocation: function(loc){
      return function(){
        var editableLayers = common.leaflet.layers['drawLayers'];
        var strCoords = loc.lat + "," + loc.lng;
        ctrl.activeEntry().location(strCoords);
        var coords = new L.LatLng(loc.lat, loc.lng);
        editableLayers.clearLayers();
        common.leaflet.addMarker(coords, false);
        common.leaflet.addPopup(coords, "<h5>Location Saved!</h5>Your coordinates are<br/>" + strCoords);
      }
    }
  });

  this.initDropzone = function(entry, reqt){
    return function(elem, isInit){
      if(!isInit){

        var dz = new Dropzone(elem, {
          url: routes.controllers.Attachments.addToBucket(entry.bucketKey, reqt.id).url,
          previewTemplate: m.stringify(common.dropzonePreviewTemplate),
          dictDefaultMessage: "Drop photos here, or click to browse.",
          clickable: true,
          autoDiscover: false,
          thumbnailWidth: 128,
          thumbnailHeight: 128,
          acceptedFiles: reqt.isImage ? "image/*" : ""
        })

        dz.on("success", function (_, r){
          entry.attachments().push(r);
          if(r.metadata) {
            entry.locations().push({
              key: r.key,
              requirementId: r.requirementId,
              filename: r.filename,
              lat: r.metadata.lat, 
              lng: r.metadata.lng
            });
          }
          m.redraw();
        }.bind(this));
      }
    }
  }

  var attachmentTypes = {
    ANY: 0,
    DOCUMENT: 1,
    IMAGE: 2
  };

  var filterRequirements = function(type){
    return function() {
      var predicate = function() {
        switch(type) {
          case attachmentTypes.DOCUMENT:  {
            return function(reqt) {
              return !reqt.isImage;
            }
            break;
          }
          case attachmentTypes.IMAGE: {
            return function(reqt) {
              return reqt.isImage;
            }
            break;
          }
          case attachmentTypes.ANY:
          default: {
            return function(reqt) {
              return true;
            }
          }
        }
      }();

      return ctrl.requirements().map(function(reqts) {
        return reqts.filter(predicate);;
      });
    }
  };

  this.docModal = new common.modal.controller({
    getFor: common.attachmentsFor,
    items: filterRequirements(attachmentTypes.DOCUMENT)
  });

  this.imgModal = new common.modal.controller({
    getFor: common.attachmentsFor,
    items: filterRequirements(attachmentTypes.IMAGE)
  });

  this.preamble = m.prop(false);
  this.disasterId = m.prop(1),
  this.entries = [];
  this.newEntry = function(bucketKey){
    if(typeof bucketKey == "string"){

      var entry = {
        description: m.prop(""),
        amount: m.prop(0),
        projectTypeId: m.prop(1),
        location: m.prop(""),
        locations: m.prop([]),
        attachments: m.prop([]),
        bucketKey: bucketKey,
        remove: function(){ 
          ctrl.removeEntry(entry); },
        openLocationModal: function(){
          ctrl.activeEntry(entry);
          ctrl.locModal.open();
        },
        openAttachmentsModal: function(){
          ctrl.activeEntry(entry);
          ctrl.docModal.open();
        }
      }

      ctrl.entries.push(entry);

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

  bi.ajax(routes.controllers.Requests.createMeta()).then(function (data){
    ctrl.info(data);
    ctrl.requirements(common.processReqts(data.requirements));
    ctrl.newEntry(data.bucketKey);
  });

  this.submitNewRequest = function(e){
    e.preventDefault();
    if(ctrl.preamble()) {

      bi.ajax(routes.controllers.Requests.insert(), {data: {
        disasterId: ctrl.disasterId,
        govUnitId: ctrl.govUnit().id,
        reqs: ctrl.entries
      }}).then(function (r){
        var msg = "Successfully created " + r.reqs.length + " new request(s)."
        if(r.failures){
          msg += "\n\nFailed to create " + r.failures + " request(s)."
        }
        msg += "\n\nRedirecting you back to request listing."
        alert(msg);
        m.route(routes.controllers.Requests.index().url);
      }, function (r){
        common.formErrorHandler(r);
        ctrl.submitButtonDisabled(false);
      });
      
    } else {
      alert('To avoid double-budgeting, please make sure to request for assistance only once!');
    }
  };

}
