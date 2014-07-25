request.controller = function(){
  var ctrl = this;
  this.app = new app.controller();
  
  this._requirements = m.prop([]);
  this.requirements = m.prop([]);
  this.required = m.prop([]);
  this.requirementsModal = new common.modal.controller({
    requirements: ctrl._requirements,
    initAndOpen: function(){
      var map = [];
      var reqts = ctrl.requirementsModal.requirements();
      for(var i in reqts){
        map[reqts[i].id] = m.prop(ctrl.required().indexOf(reqts[i].id) != -1);
      }
      ctrl.requirementsModal.requiredMap = map;
      ctrl.requirementsModal.open();
    },
    submit: function(e){
      e.preventDefault();
      var map = ctrl.requirementsModal.requiredMap;
      var reqtIds = [];
      for(var i in map){
        if(map[i]()) reqtIds.push(parseInt(i));
      }
      bi.ajax(routes.controllers.Requests.updateRequirements(ctrl.id),
        {data: {requirementIds: reqtIds}}
      ).then(function (r){
        ctrl.required(reqtIds);
        ctrl.history(r.events.concat(ctrl.history()));
        ctrl.requirementsModal.close();
      });
    }
  });

  this.signoffModal = new common.modal.controller({
    signoff: function(e){
      e.preventDefault();
      bi.ajax(routes.controllers.Requests.signoff(ctrl.id), {
        data: {password: ctrl.signoffModal.password}
      }).then(function (r){
        signoffActions(r);
        alert('Signoff successful!');
        ctrl.signoffModal.close();
      }, common.formErrorHandler);
    }
  });

  this.rejectModal = new common.modal.controller({
    reject: function(e){
      e.preventDefault();
      bi.ajax(routes.controllers.Requests.reject(ctrl.id), {
        data: {password: ctrl.rejectModal.password, content: ctrl.rejectModal.content}
      }).then(function (r){
        ctrl.canSignoff(false);
        ctrl.request().isRejected = true;
        alert('Request rejected.');
        ctrl.rejectModal.close();
        ctrl.history().unshift(r.event);
      }, common.formErrorHandler);
    }
  });

  this.saroModal = new common.modal.controller({
    submit: function(e){
      e.preventDefault();
      bi.ajax(routes.controllers.Requests.signoff(ctrl.id), {
        data: {password: ctrl.saroModal.password, content: ctrl.saroModal.content}
      }).then(function (r){
        signoffActions(r);
        ctrl.request().isSaroAssigned = true;
        ctrl.saroModal.close();
        alert('SARO assigned.');
      }, common.formErrorHandler);
    }
  });

  this.addProjectModal = new common.modal.controller({
    projectTypes: m.prop([]),
    projectScopes: m.prop([]),
    project: {
      name: m.prop(),
      amount: m.prop(),
      typeId: m.prop(),
      scope: m.prop()
    },
    submit: function(e){
      e.preventDefault();
      bi.ajax(routes.controllers.Projects.insert(ctrl.id), {
        data: ctrl.addProjectModal.project
      }).then(function (r){
        alert('Submitted!')
        ctrl.projects().unshift(r.project);
        ctrl.history().unshift(r.event);
        ctrl.addProjectModal.close();
      }, common.formErrorHandler);
    }
  });

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

  this.attachments = m.prop([]);

  this.history = m.prop([]);
  this.location = m.prop("");
  this.hasCoords = false;
  this.isInvolved = m.prop(false);
  this.canSignoff = m.prop(false);
  this.canEdit = m.prop(false);
  this.hasSignedoff = m.prop(false);
  this.input = { comment: m.prop() };

  this.unassignedAgency = {id: 0};
  this.assessingAgency = m.prop(this.unassignedAgency);
  this.implementingAgency = m.prop(this.unassignedAgency);
  this.executingAgency = m.prop(this.unassignedAgency);
  this.coords = m.prop();
  
  this.assessingAgencies = m.prop([]);
  this.implementingAgencies = m.prop([]);
  this.executingAgencies = m.prop([]);

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
      return (ctrl.app.isSuperAdmin() || ctrl.app.isDBM());
    }, edit("implementingAgency"), save("implementingAgency",
      function (r){
        var agency = extractAgency(r);
        if(agency.id){
          ctrl.implementingAgency(agency);
        } else {
          ctrl.implementingAgency(ctrl.unassignedAgency);
        }
      }
    )),

    execute: new deg(function(){
      return (ctrl.app.isSuperAdmin() || ctrl.app.isDBM() || ctrl.currentUserBelongsToImplementingAgency())
    }, edit("executingAgency"), save("executingAgency",
      function (r){
        var agency = extractAgency(r);
        if(agency.id){
          ctrl.executingAgency(agency);
          if(process.levelDict[ctrl.request().level + 1] == "EXECUTOR_ASSIGNMENT") {
            ctrl.request().level++;
          }
        } else {
          ctrl.executingAgency(ctrl.unassignedAgency);
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
    var agency = process.levelToAgencyName()[this.request().level];
    switch (agency) {
      case "ASSESSING_AGENCY": {
        if (this.assessingAgency().id){
          return this.assessingAgency().name;
        } else {
          return "AWAITING_ASSIGNMENT";
        }
      }
      case "IMPLEMENTING_AGENCY": {
        if (this.executingAgency().id){
          return this.executingAgency().name;
        } else {
          return "AWAITING_ASSIGNMENT";
        }
      }
      default: return agency;
    }
  }

  bi.ajax(routes.controllers.Requests.viewMeta(this.id)).then(function (data){

    this.request(data.request);
    this.projects(data.projects);

    this.author(data.author);
    this.govUnit(data.govUnit);
    this._requirements(data.requirements);
    this.requirements(common.processReqts(data.requirements));
    this.required(data.required);

    this.attachments(data.attachments);
    this.history(data.history);
    this.assessingAgencies(data.assessingAgencies);
    this.implementingAgencies(data.implementingAgencies);
    this.executingAgencies(data.implementingAgencies); // Make a new list that includes even LGUs.
    this.assessingAgency(data.assessingAgency || this.unassignedAgency);
    this.implementingAgency(data.implementingAgency || this.unassignedAgency);
    this.executingAgency(data.executingAgency || this.unassignedAgency);

    this.isInvolved(data.isInvolved);
    this.hasSignedoff(data.hasSignedoff)
    this.canSignoff(data.canSignoff);
    this.canEdit(data.canEdit);
    request.disasterTypes(data.disasterTypes);

    this.addProjectModal.projectTypes(data.projectTypes);
    this.addProjectModal.projectScopes(data.projectScopes);

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
    var split = ctrl.location().split(',').map(function(coord){return parseFloat(coord)});
    ctrl.hasCoords = !_.contains(split, NaN) && !(split.length % 2)
    if(ctrl.hasCoords){
      this.coords(new L.LatLng(split[0], split[1]));
    } else if(data.govUnit.coords){
      var c = data.govUnit.coords;
      var latlng = new L.LatLng(c.lat, c.lng);
      this.coords(latlng);
    }

  }.bind(this));

  var signoffActions = function(r){
    ctrl.history().unshift(r.event);
    ctrl.canSignoff(false);
    ctrl.hasSignedoff(true);
    if((process.levelDict[(ctrl.request().level) + 1] == "SARO_ASSIGNMENT") &&
      ctrl.executingAgency() != ctrl.unassignedAgency
    ){
      ctrl.request().level += 2;
    } else {
      ctrl.request().level++;
    }
  }

  this.initMap = function(elem, isInit){
    !function tryMap(){
      if($(elem).height()){

        var map = common.leaflet.map(elem);

        if(ctrl.canEdit){
          common.leaflet.addDrawControls(function (e){

            common.leaflet.clearMarkers();

            var layer = e.layer;
            var coords = layer._latlng
            var strCoords = coords.lat+","+coords.lng

            save("location").bind({input: m.prop(strCoords)})(function(){
              ctrl.coords(coords);
              ctrl.hasCoords = true;
            });

          });
        }

        if(ctrl.coords()){
          map.setView(ctrl.coords(), 8);
          common.leaflet.addMarker(ctrl.coords());
          if(!ctrl.hasCoords){
            setTimeout(function(){
              common.leaflet.addPopup(ctrl.coords(), "No location defined but<br/>the requesting LGU is here.")
            }, 100);
          }
        }

      } else {
        setTimeout(tryMap, 100);
      }
    }()
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
          maxFiles: 1,
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

  this.archive = function(att){
    bi.ajax(routes.controllers.Attachments.archive(att.id)).then(function (r){
      var a = ctrl.attachments();
      a.splice(a.indexOf(att), 1);
      ctrl.history().unshift(r.event);
    });
  }

  this.attachmentFor = common.attachmentFor;

}
