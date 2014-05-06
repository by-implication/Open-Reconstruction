request.controller = function(){
  var map;
  this.app = new app.controller();
  this.signoffModal = new common.modal.controller();
  var requestId = m.route.param('id');
  this.requestTabs = new common.tabs.controller();
  this.requestTabs.tabs([
    {label: m.prop("Assignments"), href: routes.controllers.Requests.viewAssignments(requestId).url},
    {label: m.prop("Images"), href: routes.controllers.Requests.viewImages(requestId).url},
    {label: m.prop("Documents"), href: routes.controllers.Requests.viewDocuments(requestId).url},
    {label: m.prop("Activity"), href: routes.controllers.Requests.viewActivity(requestId).url}
  ]);
  this.requestTabs.currentTab(this.requestTabs.tabs()[0].label)

  this.tabs = new common.tabs.controller();
  this.id = m.route.param("id");
  this.request = m.prop({});
  this.author = m.prop({});
  this.attachments = m.prop({});
  this.history = m.prop({});
  this.oldRequest = m.prop({});
  this.location = m.prop("");
  this.isInvolved = m.prop(false);
  this.canSignoff = m.prop(false);
  this.canEdit = m.prop(false);
  this.hasSignedoff = m.prop(false);
  this.input = {
    assessingAgency: m.prop(),
    implementingAgency: m.prop(),
    comment: m.prop()
  };
  this.assessingAgency = m.prop();
  this.implementingAgency = m.prop();
  this.coords = m.prop();
  
  this.assessingAgencies = m.prop([]);
  this.implementingAgencies = m.prop([]);

  // displayEditGroups
  this.degDescription = new displayEditGroup.controller(this.request, "description");
  this.degAmount = new displayEditGroup.controller(this.request, "amount");
  this.degDisaster = new displayEditGroup.controller(this.request, "disaster");
  this.degLocation = new displayEditGroup.controller(this.request, "location");

  var parseLocation = function(location){
    var split = location.split(',').map(function(coord){return parseFloat(coord)});
    if (_.contains(split, NaN) || (split.length % 2)) {
      // display as plain string
      return; 
    } else {
      this.coords(new L.LatLng(split[0], split[1]));
      window.setTimeout(function(){
        if(map) map.setView(this.coords(), 8);
        L.marker(this.coords()).addTo(map);
      }.bind(this), 200) // I'M SO SORRY
    }
  }.bind(this)

  this.dropzone = null;

  this.curUserCanUpload = function(){
    // if requester, you can only upload if the assessor hasn't approved it
    return (this.currentUserIsAuthor() && this.request().level === 0)
    ||
    // if assesor, can only upload if you haven't approved it
    (this.currentUserBelongsToAssessingAgency() && this.request().level === 0)
    ||
    // if OCD, can only upload if you haven't approved it
    (this.app.isSuperAdmin() && this.request().level <= 1)
  }

  this.currentUserBelongsToAssessingAgency = function(){
    return this.assessingAgency() && this.app.getCurrentUserProp("agency") && (this.assessingAgency().id === this.app.getCurrentUserProp("agency").id);
  }

  this.currentUserIsAuthor = function(){
    return this.author().handle === this.app.getCurrentUserProp("handle");
  }

  this.getBlockingAgency = function(){
    var agency = process.levelToAgencyName()[this.request().level]
    if(agency === "ASSESSING_AGENCY"){
      if (this.assessingAgency()){
        return this.assessingAgency().name;
      } else {
        return "AWAITING_ASSIGNMENT";
      }
    } else {
      return agency;
    }
  }

  bi.ajax(routes.controllers.Requests.viewMeta(this.id)).then(function(data){
    this.request(data.request);
    this.author(data.author);
    this.attachments(data.attachments);
    this.history(data.history);
    this.assessingAgencies(data.assessingAgencies);
    this.implementingAgencies(data.implementingAgencies);
    this.assessingAgency(data.assessingAgency);
    this.implementingAgency(data.implementingAgency);

    this.input.assessingAgency(data.request.assessingAgencyId);
    this.input.implementingAgency(data.request.implementingAgencyId);  

    this.isInvolved(data.isInvolved);
    this.hasSignedoff(data.hasSignedoff)
    this.canSignoff(data.canSignoff);
    this.canEdit(data.canEdit);
    parseLocation(data.request.location);
  }.bind(this));

  database.pull().then(function(data){
    this.oldRequest(database.requestList()[this.id - 1]);
  }.bind(this))

  this.signoffModal.signoff = function(e){
    e.preventDefault();
    bi.ajax(routes.controllers.Requests.signoff(this.id), {
      data: {password: this.signoffModal.password}
    }).then(function (r){
      if(r.success){
        this.canSignoff(false);
        this.hasSignedoff(true);
        alert('Signoff successful!');
        this.signoffModal.close();
        this.history().unshift(r.event);
      } else {
        alert("Failed to signoff: " + r.messages.password);
      }
    }.bind(this));
  }.bind(this);

  this.initMap = function(elem, isInit){
    if(!isInit){
      window.setTimeout(function(){
        map = L.map(elem, {scrollWheelZoom: false}).setView([11.3333, 123.0167], 5);
        var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 19, attribution: osmAttrib}).addTo(map);   

        var editableLayers = new L.FeatureGroup();
        map.addLayer(editableLayers);

        // Initialise the draw control and pass it the FeatureGroup of editable layers
      }, 100) // I'M SO SORRY
    }
  }.bind(this)

  this.refreshHistory = function(){
    bi.ajax(routes.controllers.Requests.viewMeta(this.id)).then(function(data){
      this.history(data.history);
      m.redraw();
    }.bind(this))
  }

  this.submitComment = function(e){
    e.preventDefault()
    bi.ajax(routes.controllers.Requests.comment(this.id), {data: {content: this.input.comment}}).then(function(r){
      console.log('Comment submitted!');
      this.refreshHistory();
    }.bind(this));
  }.bind(this);

  this.updateAssessingAgency = function(e){
    this.input.assessingAgency(e);
    bi.ajax(routes.controllers.Requests.assignAssessingAgency(this.id, this.input.assessingAgency())).then(function(r){
      console.log('Assessing agency submitted!');
    })
  }.bind(this);

  this.updateImplementingAgency = function(e){
    this.input.implementingAgency(e);
    bi.ajax(routes.controllers.Requests.assignImplementingAgency(this.id, this.input.implementingAgency())).then(function(r){
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
        url: routes.controllers.Attachments.add(this.id, "img").url,
        previewTemplate: m.stringify(dropzonePreviewTemplate), 
        dictDefaultMessage: "Drop photos here, or click to browse.",
        clickable: true,
        autoDiscover: false,
        thumbnailWidth: 128,
        thumbnailHeight: 128,
        acceptedFiles: "image/*"
      })

      this.dropzone.on("success", function (_, r){
        this.attachments().imgs.push(r.attachment);
        this.history().unshift(r.event);
        m.redraw();
      }.bind(this));

    }
  }.bind(this);

  this.initDocDropzone = function(elem, isInit){
    if(!isInit){

      this.dropzone = new Dropzone(elem, {
        url: routes.controllers.Attachments.add(this.id, "doc").url,
        previewTemplate: m.stringify(dropzonePreviewTemplate), 
        dictDefaultMessage: "Drop documents here, or click to browse. We recommend pdfs and doc files.",
        clickable: true,
        autoDiscover: false
      });

      this.dropzone.on("success", function (_, r){
        this.attachments().docs.push(r.attachment);
        this.history().unshift(r.event);
        m.redraw();
      }.bind(this));

    }
  }.bind(this);
}