request.controller = function(){
  var self = this;
  this.app = new app.controller();
  this.signoffModal = new common.modal.controller();
  this.rejectModal = new common.modal.controller();
  this.saroModal = new common.modal.controller();
  this.addProjectModal = new common.modal.controller();
  this.addProjectModal.project = {
    name: m.prop(),
    amount: m.prop()
  }
  var requestId = m.route.param('id');
  this.requestTabs = new common.stickyTabs.controller();
  this.requestTabs.tabs([
    {label: m.prop("Summary"), href: "#summary"},
    {label: m.prop("Assignments"), href: "#assignments"},
    {label: m.prop("Images"), href: "#images"},
    {label: m.prop("Documents"), href: "#documents"},
    {label: m.prop("References"), href: "#references"},
    {label: m.prop("Activity"), href: "#activity"}
  ]);
  // this.requestTabs.currentSection("#summary");

  this.id = m.route.param("id");

  this.request = m.prop({
    amount: 0,
    date: "",
    description: "",
    disaster: {
      date: "",
      name: "",
      type: ""
    },
    isRejected: false,
    level: 0,
    location: "",
    projectType: ""
  });

  this.projects = m.prop([]);

  this.author = m.prop({
    id: 0,
    name: ""
  });

  this.attachments = m.prop({
    imgs: [],
    docs: []
  });

  this.history = m.prop([]);
  this.location = m.prop("");
  this.isInvolved = m.prop(false);
  this.canSignoff = m.prop(false);
  this.canEdit = m.prop(false);
  this.hasSignedoff = m.prop(false);
  this.input = { comment: m.prop() };

  this.addProjectModal.submitProject = function(e){
    e.preventDefault();
    bi.ajax(routes.controllers.Projects.insert(self.id), {
      data: {
        name: self.addProjectModal.project.name(),
        amount: self.addProjectModal.project.amount()
      }
    }).then(function (r){
      if(r.success){
        alert('Submitted!')
        self.history().unshift(r.event);
      } else {
        alert("Your input was invalid.");
      }
    }.bind(this));
  }

  this.unassignedAgency = {id: 0};
  this.assessingAgency = m.prop(this.unassignedAgency);
  this.implementingAgency = m.prop(this.unassignedAgency);
  this.coords = m.prop();
  
  this.assessingAgencies = m.prop([]);
  this.implementingAgencies = m.prop([]);

  // displayEditGroups
  var deg = displayEditGroup;
  var ctrl = this;
  
  var edit = function(field){
    return function (c){
      var value = ctrl.request()[field];
      if(typeof value == "object") value = _.extend({}, value);
      this.input(value);
      c();
    }
  }

  var save = function(field, processResult){
    processResult = processResult || function(){};
    return function (c){
      bi.ajax(routes.controllers.Requests.editField(ctrl.id, field), {
        data: {input: this.input}
      }).then(function (r){
        if(r.success){
          ctrl.request()[field] = this.input();
          ctrl.history().unshift(r.event);
          processResult(r);
        } else {
          alert("Your input was invalid.");
        }
        c();
      }.bind(this));
    }
  }

  var extractAgency = function(r){
    var params = r.event.content.split(" ");
    var agencyType = params.pop();
    return {
      id: parseInt(params.pop()),
      name: params.join(" ")
    };
  }

  var degs = {
    
    description: new deg(this.canEdit, edit("description"), save("description")),
    amount: new deg(this.canEdit, edit("amount"), save("amount")),
    location: new deg(this.canEdit, edit("location"), save("location")),
    disaster: new deg(this.canEdit, edit("disaster"), save("disaster"), function (c){
      this.htmlDate("");
      c();
    }, {htmlDate: m.prop("")}),

    assess: new deg(this.app.isSuperAdmin, edit("assessingAgency"), save("assessingAgency",
      function (r){
        var agency = extractAgency(r);
        if(agency.id){
          ctrl.assessingAgency(agency);
          ctrl.request().level = 1;
        } else {
          ctrl.assessingAgency(ctrl.unassignedAgency);
          ctrl.request().level = 0;
        }
      }
    )),

    implement: new deg(this.app.isSuperAdmin, edit("implementingAgency"), save("implementingAgency",
      function (r){
        var agency = extractAgency(r);
        if(agency.id){
          ctrl.implementingAgency(agency);
        } else {
          ctrl.implementingAgency(ctrl.unassignedAgency);
        }
      }
    ))

  };
  this.degs = degs;

  degs.disaster.input.setName = function(v){
    degs.disaster.input().name = v;
  }
  degs.disaster.input.setTypeId = function(v){
    degs.disaster.input().typeId = v;
  }
  degs.disaster.input.setDate = function(v){
    var newDate = (new Date(v)).getTime();
    degs.disaster.input().date = newDate;
    degs.disaster.htmlDate(helper.toDateValue(newDate));
  }

  

  this.curUserCanUpload = function(){
    // if requester, you can only upload if the assessor hasn't approved it
    return (this.currentUserIsAuthor() && this.request().level < 2) ||
    // if assesor, can only upload if you haven't approved it
    (this.currentUserBelongsToAssessingAgency() && this.request().level === 1) ||
    // if OCD, can only upload if you haven't approved it
    (this.app.isSuperAdmin() && this.request().level < 3) ||
    // implementer can upload
    (this.currentUserBelongsToImplementingAgency())
  }

  this.currentUserBelongsToAssessingAgency = function(){
    return this.assessingAgency().id &&
    this.app.getCurrentUserProp("govUnit").id &&
    (this.assessingAgency().id === this.app.getCurrentUserProp("govUnit").id);
  }

  this.currentUserBelongsToImplementingAgency = function(){
    return this.implementingAgency() && this.app.getCurrentUserProp("govUnit") && (this.implementingAgency().id === this.app.getCurrentUserProp("govUnit").id);
  }

  this.currentUserCanAssignFunding = function(){
    return this.app.getCurrentUserProp("govUnit") && this.app.getCurrentUserProp("govUnit").role == "DBM"
  }

  this.currentUserIsAuthor = function(){
    return this.author().handle === this.app.getCurrentUserProp("handle");
  }

  this.getBlockingAgency = function(){
    var agency = process.levelToAgencyName()[this.request().level]
    if(agency === "ASSESSING_AGENCY"){
      if (this.assessingAgency().id){
        return this.assessingAgency().name;
      } else {
        return "AWAITING_ASSIGNMENT";
      }
    } else {
      return agency;
    }
  }

  bi.ajax(routes.controllers.Requests.viewMeta(this.id)).then(function (data){

    this.request(data.request);
    this.projects(data.projects);
    degs.disaster.input.name = data.request.disaster.name;
    degs.disaster.input.typeId = data.request.disaster.typeId;
    degs.disaster.input.date = data.request.disaster.date;

    this.author(data.author);
    this.attachments(data.attachments);
    this.history(data.history);
    this.assessingAgencies(data.assessingAgencies);
    this.implementingAgencies(data.implementingAgencies);
    this.assessingAgency(data.assessingAgency || this.unassignedAgency);
    this.implementingAgency(data.implementingAgency || this.unassignedAgency);

    this.isInvolved(data.isInvolved);
    this.hasSignedoff(data.hasSignedoff)
    this.canSignoff(data.canSignoff);
    this.canEdit(data.canEdit);
    request.disasterTypes(data.disasterTypes);

    this.request().stagnation = common.stagnation(this);
    if(data.request.level < 4 && !data.request.isRejected){
      !function update(){
        var element = document.getElementById("stagnation-" + this.id);
        if(element){
          element.innerHTML = common.stagnation(this)
        }
        if(m.route().startsWith(routes.controllers.Requests.view(requestId).url)){
          setTimeout(update.bind(this), 1000);
        }
      }.bind(this)();
    }

    this.location(data.request.location);
    var split = self.location().split(',').map(function(coord){return parseFloat(coord)});
    if(!_.contains(split, NaN) && !(split.length % 2)){
      this.coords(new L.LatLng(split[0], split[1]));
    }

  }.bind(this));

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
        this.request().level++;
      } else {
        alert("Failed to signoff: " + r.messages.password);
      }
    }.bind(this));
  }.bind(this);

  this.rejectModal.reject = function(e){
    e.preventDefault();
    bi.ajax(routes.controllers.Requests.reject(this.id), {
      data: {password: this.rejectModal.password, content: this.rejectModal.content}
    }).then(function (r){
      if(r.success){
        this.canSignoff(false);
        this.request().isRejected = true;
        alert('Request rejected.');
        this.rejectModal.close();
        this.history().unshift(r.event);
      } else {
        var errors = [];
        for(var field in r.messages){
          errors.push([field, r.messages[field]]);
        }
        alert("Failed to reject:\n" + errors.join("\n"));
      }
    }.bind(this));
  }.bind(this);

  this.saroModal.submit = function(e){
    e.preventDefault();
    bi.ajax(routes.controllers.Requests.assignSaro(ctrl.id), {
      data: {input: this.saroModal.content}
    }).then(function (r){
      if(r.success){
        ctrl.history().unshift(r.event);
        alert('SARO assigned.');
        this.saroModal.close();
      } else {
        alert("An error occurred.");
      }
    }.bind(this));
  }.bind(this);

  this.initMap = function(elem, isInit){
    if(!isInit && self.coords()){

      !function tryMap(){
        if($(elem).height()){
          var map = L.map(elem, {scrollWheelZoom: false}).setView([11.3333, 123.0167], 5);
          var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
          var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
          var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 19, attribution: osmAttrib}).addTo(map);
          map.setView(self.coords(), 8);
          L.marker(self.coords()).addTo(map);
        } else {
          setTimeout(tryMap, 100);
        }
      }()

    }
  }

  this.refreshHistory = function(){
    bi.ajax(routes.controllers.Requests.viewMeta(this.id)).then(function(data){
      this.history(data.history);
      m.redraw();
    }.bind(this))
  }

  this.submitComment = function(e){
    e.preventDefault()
    bi.ajax(routes.controllers.Requests.comment(this.id), {data: {content: this.input.comment}})
    .then(function (r){
      console.log('Comment submitted!');
      this.refreshHistory();
    }.bind(this));
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

      var dz = new Dropzone(elem, {
        url: routes.controllers.Attachments.add(this.id, "img").url,
        previewTemplate: m.stringify(dropzonePreviewTemplate), 
        dictDefaultMessage: "Drop photos here, or click to browse.",
        clickable: true,
        autoDiscover: false,
        thumbnailWidth: 128,
        thumbnailHeight: 128,
        acceptedFiles: "image/*"
      })

      dz.on("success", function (_, r){
        this.attachments().imgs.push(r.attachment);
        this.history().unshift(r.event);
        m.redraw();
      }.bind(this));

    }
  }.bind(this);

  this.initDocDropzone = function(elem, isInit){
    if(!isInit){

      var dz = new Dropzone(elem, {
        url: routes.controllers.Attachments.add(this.id, "doc").url,
        previewTemplate: m.stringify(dropzonePreviewTemplate), 
        dictDefaultMessage: "Drop documents here, or click to browse. We recommend pdfs and doc files.",
        clickable: true,
        autoDiscover: false
      });

      dz.on("success", function (_, r){
        this.attachments().docs.push(r.attachment);
        this.history().unshift(r.event);
        m.redraw();
      }.bind(this));

    }
  }.bind(this);
}
