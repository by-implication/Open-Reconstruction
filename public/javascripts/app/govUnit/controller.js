govUnit.controller = function(){
  this.app = new app.controller();
  this.id = m.route.param("id");
  this.page = parseInt(m.route.param("page")) || 1;
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

  bi.ajax(routes.controllers.GovUnits.viewMeta(this.id, this.page)).then(function (r){
    ctrl.govUnit(r.govUnit);
    ctrl.users(r.users);
    ctrl.requests(r.requests);
    ctrl.totalReqs(r.totalReqs);
    ctrl.pageLimit(r.pageLimit);
    if(r.lgu){
      ctrl.children(r.lgu.children);
      ctrl.ancestors(r.lgu.ancestors);
      ctrl.incomeClass(r.lgu.incomeClass);
      if(r.lgu.lat){
        ctrl.coords(new L.LatLng(r.lgu.lat, r.lgu.lng));
      }
    }
  });

}