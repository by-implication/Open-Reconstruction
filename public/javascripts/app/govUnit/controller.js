govUnit.controller = function(){
  this.app = new app.controller();
  this.id = m.route.param("id");
  this.page = parseInt(m.route.param("p")) || 1;
  var ctrl = this;
  this.govUnit = m.prop({
    id: -1,
    name: "My Agency",
    acronym: "",
    role: ""
  });
  this.users = m.prop([]);
  this.requests = m.prop([]);
  this.totalReqs = m.prop(0);
  this.pageLimit = m.prop(1);
  this.children = m.prop([]);
  this.ancestors = m.prop([]);
  this.incomeClass = m.prop(0);
  this.coords = m.prop();

  this.tab = m.route.param("t") || "users";
  this.tabs = new common.tabs.controller();

  this.tabs.tabs = m.prop([
    {label: m.prop("Users"), href: routes.controllers.GovUnits.viewTab(ctrl.id, "users").url},
    {label: m.prop("Requests"), href: routes.controllers.GovUnits.viewTab(ctrl.id, "requests").url}, 
    {label: m.prop("Sub-LGUs"), href: routes.controllers.GovUnits.viewTab(ctrl.id, "sub-lgus").url},
  ]);

  this.initMap = function(elem, isInit){
    !function tryMap(){
      if($(elem).height()){
        var map = common.leaflet.map(elem);
        if(ctrl.coords()){
          map.setView(ctrl.coords(), 8);
          common.leaflet.addMarker(ctrl.coords());
        }
      } else {
        setTimeout(tryMap, 100);
      }
    }()
  }

  this.editUserModal = new common.modal.controller({
    input: {
      id: m.prop(0),
      name: m.prop(""),
      handle: m.prop(""),
      isAdmin: m.prop(false)
    },
    submit: function(e){
      e.preventDefault();
      bi.ajax(routes.controllers.Users.update(ctrl.id, ctrl.editUserModal.input.id()), {
        data: ctrl.editUserModal.input
      }).then(function (r){
        ctrl.editUserModal.close();
        alert('User updated!');
      }, common.formErrorHandler);
    }
  });

  bi.ajax(routes.controllers.GovUnits.viewMeta(this.id, this.tab, this.page)).then(function (r){
    ctrl.govUnit(r.govUnit);
    if(r.lgu){
      ctrl.incomeClass(r.lgu.incomeClass);
      ctrl.ancestors(r.lgu.ancestors);
      if(r.lgu.lat){
        ctrl.coords(new L.LatLng(r.lgu.lat, r.lgu.lng));
      }
    } 

    if (!r.lgu || !r.lgu.children.length) {
      ctrl.tabs.tabs().splice(2, 1);
    }

    switch(ctrl.tabs.currentTab()){
      case "Requests": {
        ctrl.requests(r.data.requests);
        ctrl.totalReqs(r.data.totalReqs);
        ctrl.pageLimit(r.data.pageLimit);
        break;
      }
      case "Users": {
        ctrl.users(r.data.users.map(function(u){
          u.edit = function(){
            ctrl.editUserModal.input.id(u.id);
            ctrl.editUserModal.input.name(u.name);
            ctrl.editUserModal.input.handle(u.handle);
            ctrl.editUserModal.input.isAdmin(u.isAdmin);
            ctrl.editUserModal.open();
          }
          return u;
        }))
        break;
      }
      case "Sub-LGUs": {
        if(r.lgu){
          ctrl.children(r.lgu.children);
        }
        break;
      }
    }
  });
}