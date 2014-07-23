requestListing.controller = function(){

  var self = this;
  this.app = new app.controller();
  this.filterAccordion = new common.accordion.controller();

  this.locationCF = new common.collapsibleFilter.controller("Location", "location", this.filterAccordion);
  this.disasterCF = new common.collapsibleFilter.controller("Disaster", "disaster", this.filterAccordion);
  this.agencyCF = new common.collapsibleFilter.controller("Agency", "agency", this.filterAccordion);
  this.projectTypeCF = new common.collapsibleFilter.controller("Project Type", "project_type", this.filterAccordion);

  this.filterAccordion.drawers([
    self.locationCF, 
    self.disasterCF, 
    self.agencyCF,
    self.projectTypeCF
  ])
  
  this.disasters = [];

  this.page = parseInt(m.route.param("page")) || 1;
  this.pageLimit = 1;
  this.projectTypeId = m.route.param("projectTypeId") || 0;
  this.agencyFilterId = m.route.param("agencyFilterId") || 0;
  this._queryLocFilters = m.route.param("l") || "-";
  this.sort = m.route.param("sort") || "id";
  this.sortDir = m.route.param("sortDir") || "asc";
  this.disaster = m.route.param("disaster") || 0;

  var nav = this.nav = function(params, meta){
    var keys = ["page", "projectTypeId", "_queryLocFilters", "sort", "sortDir", "disaster", "agencyFilterId"];
    var p = {};
    keys.forEach(function (k){
      p[k] = self[k];
    });
    for(var k in params){
      if(k != 'page'){
        params.page = 1;
        break;
      }
    }
    _.extend(p, params);
    return routes.controllers.Requests[meta ? "indexMeta" : "indexPage"].apply(
      null, keys.map(function (k){ return p[k]; })
    ).url;
  }
  
  this.sortBy = function(sort){
    var sortDir = (self.sortDir == "asc" && sort == self.sort) ? "desc" : "asc";
    return nav({sort: sort, sortDir: sortDir});
  }

  this.queryLocFilters = function(){
    var f = self._queryLocFilters;
    f = (f != "-" && f.split(".")) || [];
    while(f.length < 4){ f.push("-");}
    return f;
  }
  this.counts = {};

  this.hierarchy = ["Region", "Province", "City / Municipality", "Barangay"];

  function DefLocFilter(label, value){
    this.label = label;
    this.data = [];
    this.value = m.prop(value);
    this.onchange = function(data){
      var v = data.id;
      var _qlf = self._queryLocFilters;
      var i = self.hierarchy.indexOf(label);
      var qlf = (v == '-' && i) ? _qlf.split(".").slice(0, i).join(".") : v;
      this.value(v);
      var targetRoute = nav({_queryLocFilters: qlf});
      m.route(targetRoute);
    }.bind(this);
  };

  this.locFilters = this.hierarchy.map(function (label, index){
    var val;
    var qlf = self.queryLocFilters();
    if(qlf[index] != "-"){
      val = qlf.slice(0, index+1).join(".");
    } else {
      val = "-"
    }
    return new DefLocFilter(label, val);
  });

  this.requestList = [];
  this.projectFilters = [{id: 0, name: "All"}];
  this.agencies = [{id: 0, name: "All", acronym: "All"}];

  bi.ajax(nav(null, true)).then(function (r){

    this.requestList = r.list;
    this.count = r.count;
    this.pageLimit = r.pageLimit;
    this.projectFilters = this.projectFilters.concat(r.filters);
    this.agencies = this.agencies.concat(r.agencies);
    this.disasters = [{id: 0, name: "All"}].concat(r.disasters);
    for(var i in r.locFilters){
      this.locFilters[i].data = [{id: '-', name: 'All'}].concat(r.locFilters[i].sort(function (a, b){
        return a.id - b.id;
      }));
    }

  }.bind(this));

}