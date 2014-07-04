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
    {label: m.prop("Documents"), href: "#documents"},
    {label: m.prop("References"), href: "#references"},
    {label: m.prop("Activity"), href: "#activity"}
  ]);

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

  this.govUnit = m.prop({
    id: 0,
    name: ""
  });

  this.requirements = m.prop([]);
  this.attachments = m.prop([]);

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
      alert('Submitted!')
      self.history().unshift(r.event);
    }, common.formErrorHandler);
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
        ctrl.request()[field] = this.input();
        ctrl.history().unshift(r.event);
        processResult(r);
        c();
      }.bind(this), function (r){
        common.formErrorHandler(r);
        c();
      });
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

    implement: new deg(function(){
      return (self.app.isSuperAdmin() || self.app.isDBM());
    }, edit("implementingAgency"), save("implementingAgency",
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

  this.curUserCanUpload = function(){
    return m.cookie().logged_in && (
    // if requester, you can only upload if the assessor hasn't approved it
    (this.currentUserIsAuthor() && this.request().level < 2) ||
    // if assesor, can only upload if you haven't approved it
    (this.currentUserBelongsToAssessingAgency() && this.request().level === 1) ||
    // if OCD, can only upload if you haven't approved it
    (this.app.isSuperAdmin() && this.request().level < 3) ||
    // implementer can upload
    (this.currentUserBelongsToImplementingAgency()))
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
    var govUnit = this.app.getCurrentUserProp("govUnit");
    return govUnit && govUnit.role == "DBM";
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

    this.author(data.author);
    this.govUnit(data.govUnit);

    var _reqs = [];
    data.requirements.forEach(function (r){
      if(!_reqs[r.level]){
        _reqs[r.level] = [];
      }
      _reqs[r.level].push(r);
    })
    this.requirements(_reqs);

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
      var baseTime = new Date().getTime();
      !function update(offset){
        var element = document.getElementById("stagnation-" + this.id);
        if(element){
          element.innerHTML = common.stagnation(this, offset);
        }
        if(m.route().startsWith(routes.controllers.Requests.view(requestId).url)){
          setTimeout(update.bind(this, (new Date().getTime() - baseTime)), 1000);
        }
      }.bind(this)(0);
    }

    this.location(data.request.location);
    var split = self.location().split(',').map(function(coord){return parseFloat(coord)});
    if(!_.contains(split, NaN) && !(split.length % 2)){
      this.coords(new L.LatLng(split[0], split[1]));
    } else if(data.author.govUnit.coords){
      var c = data.author.govUnit.coords;
      var latlng = new L.LatLng(c.lat, c.lng);
      this.coords(latlng);
      setTimeout(function(){
        common.leaflet.addPopup(latlng, "No location defined but<br/>the requesting LGU is here.")
      }, 100);
    }

  }.bind(this));

  var signoffActions = function(r){
    ctrl.history().unshift(r.event);
    ctrl.canSignoff(false);
    ctrl.hasSignedoff(true);
    ctrl.request().level++;
  }

  this.signoffModal.signoff = function(e){
    e.preventDefault();
    bi.ajax(routes.controllers.Requests.signoff(this.id), {
      data: {password: this.signoffModal.password}
    }).then(function (r){
      signoffActions(r);
      alert('Signoff successful!');
      this.signoffModal.close();
    }.bind(this), common.formErrorHandler);
  }.bind(this);

  this.rejectModal.reject = function(e){
    e.preventDefault();
    bi.ajax(routes.controllers.Requests.reject(this.id), {
      data: {password: this.rejectModal.password, content: this.rejectModal.content}
    }).then(function (r){
      this.canSignoff(false);
      this.request().isRejected = true;
      alert('Request rejected.');
      this.rejectModal.close();
      this.history().unshift(r.event);
    }.bind(this), common.formErrorHandler);
  }.bind(this);

  this.saroModal.submit = function(e){
    e.preventDefault();
    bi.ajax(routes.controllers.Requests.signoff(ctrl.id), {
      data: {password: this.saroModal.password, content: this.saroModal.content}
    }).then(function (r){
      signoffActions(r);
      ctrl.request().isSaroAssigned = true;
      this.saroModal.close();
      alert('SARO assigned.');
    }.bind(this), common.formErrorHandler);
  }.bind(this);

  this.initMap = function(elem, isInit){
    if(self.coords()){

      !function tryMap(){
        if($(elem).height()){
          var map = common.leaflet.map(elem);
          map.setView(self.coords(), 8);
          common.leaflet.addMarker(self.coords());
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
      this.refreshHistory();
    }.bind(this));
  }.bind(this);

  this.initAttachmentDropzone = function(reqt){
    return function(elem, isInit){
      if(!isInit){

        var dz = new Dropzone(elem, {
          url: routes.controllers.Attachments.add(this.id, reqt.id).url,
          previewTemplate: m.stringify(common.dropzonePreviewTemplate), 
          dictDefaultMessage: "Drop documents here, or click to browse.",
          clickable: true,
          autoDiscover: false,
          acceptedFiles: reqt.isImage ? "image/*" : ""
        });

        dz.on("success", function (_, r){
          this.attachments().push(r.attachment);
          this.history().unshift(r.event);
          m.redraw();
        }.bind(this));

      }
    }.bind(this);
  }

// <<<<<<< HEAD
//       var dz = new Dropzone(elem, {
//         url: routes.controllers.Attachments.add(this.id, "doc").url,
//         previewTemplate: m.stringify(common.dropzonePreviewTemplate), 
//         dictDefaultMessage: "Drop documents here or click to browse.",
//         clickable: true,
//         autoDiscover: false
//       });
// =======
  this.attachmentFor = function(reqt){
    var a = this.attachments();
    for(var i in a){
      if(a[i].requirementId == reqt.id){
        return a[i];
      }
    }
  }
// >>>>>>> 78d994facdd137a5e84689ff30db63f27596a819

  this.archive = function(att){
    bi.ajax(routes.controllers.Attachments.archive(att.id)).then(function (r){
      var a = ctrl.attachments();
      a.splice(a.indexOf(att), 1);
      ctrl.history().unshift(r.event);
    });
  }

}
