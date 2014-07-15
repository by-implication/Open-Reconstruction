requestListing.controller = function(){

  var self = this;
  this.app = new app.controller();
  this.tabs = new common.tabs.controller();
  this.locationCF = new common.collapsibleFilter.controller("Location", "location");
  this.disasterCF = new common.collapsibleFilter.controller("Disaster", "disaster");
  this.agencyCF = new common.collapsibleFilter.controller("Agency", "agency");
  this.projectTypeCF = new common.collapsibleFilter.controller("Project Type", "project_type");
  this.tabFilters = {
    ALL: 'all',
    SIGNOFF: 'signoff',
    ASSESSOR: 'assessor',
    EXECUTOR: 'executor',
    MINE: 'mine',
    AGENCY: 'agency',
    APPROVAL: 'approval',
    IMPLEMENTATION: 'implementation'
  }
  this.disasters = [];

  this.tab = m.route.param("tab") || "all";
  this.page = parseInt(m.route.param("page")) || 1;
  this.pageLimit = 1;
  this.projectTypeId = m.route.param("projectTypeId") || 0;
  this.agencyFilterId = m.route.param("agencyFilterId") || 0;
  this._queryLocFilters = m.route.param("l") || "-";
  this.sort = m.route.param("sort") || "id";
  this.sortDir = m.route.param("sortDir") || "asc";
  this.disaster = m.route.param("disaster") || 0;

  var nav = this.nav = function(params, meta){
    var keys = ["tab", "page", "projectTypeId", "_queryLocFilters", "sort", "sortDir", "disaster", "agencyFilterId"];
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

  var hierarchy = ["Region", "Province", "City / Municipality", "Barangay"];

  function DefLocFilter(label, value){
    this.label = label;
    this.data = [];
    this.value = m.prop(value);
    this.onchange = function(data){
      var v = data.id;
      var _qlf = self._queryLocFilters;
      var i = hierarchy.indexOf(label);
      var qlf = (v == '-' && i) ? _qlf.split(".").slice(0, i).join(".") : v;
      this.value(v);
      var targetRoute = nav({_queryLocFilters: qlf});
      m.route(targetRoute);
    }.bind(this);
  };

  this.locFilters = hierarchy.map(function (label, index){
    var val;
    var qlf = self.queryLocFilters();
    if(qlf[index] != "-"){
      val = qlf.slice(0, index+1).join(".");
    } else {
      val = "-"
    }
    return new DefLocFilter(label, val);
  });

  var tabs = [
    {
      identifier: this.tabFilters.ALL,
      href: nav({tab: "all"}),
      _label: "All"
    },
    {
      identifier: this.tabFilters.SIGNOFF,
      href: nav({tab: "signoff"}),
      when: function(){ return _.contains(self.app.currentUser().permissions, process.permissions.SIGNOFF) },
      _label: "Needs signoff"
    },
    {
      identifier: this.tabFilters.ASSESSOR,
      href: nav({tab: "assessor"}),
      when: function(){ return self.app.isSuperAdmin() },
      _label: "Needs assessor"
    },
    {
      identifier: this.tabFilters.AGENCY,
      href: nav({tab: "agency"}),
      _label: function(){
        if(self.app.currentUser().govUnit && self.app.currentUser().govUnit.role == "LGU") {
          return "My LGU's requests";
        } else {
          return "My agency's requests";
        }
      }
    },
    {
      identifier: this.tabFilters.MINE,
      href: nav({tab: "mine"}),
      _label: "My requests"
    },
    {
      identifier: this.tabFilters.EXECUTOR,
      href: nav({tab: "executor"}),
      when: function(){ return _.contains(self.app.currentUser().permissions, process.permissions.IMPLEMENT_REQUESTS) },
      _label: "Needs executor"
    },
    {
      identifier: this.tabFilters.APPROVAL,
      href: nav({tab: "approval"}),
      when: function(){ return !self.app.currentUser() },
      _label: "Pending Approval"
    },
    {
      identifier: this.tabFilters.IMPLEMENTATION,
      href: nav({tab: "implementation"}),
      when: function(){ return !self.app.currentUser() },
      _label: "Implementation"
    },
  ].map(function (tab){
    tab.requests = function(){
      return self.requestList
        .filter(function (r){ return tab.filter ? !r.isRejected : true })
        .filter(tab.filter || function(){ return true })
    }
    tab.label = function(){
      return [
        typeof tab._label == 'function' ? tab._label() : tab._label,
        m("span.label.secondary.round", self.counts[tab.identifier])
      ]
    }
    tab.content = function(){ return request.listView(this.requests(), self.sortBy) }
    return tab;
  });

  this.tabs.tabs = m.prop(tabs);
  this.requestList = [];
  this.projectFilters = [{id: 0, name: "All"}];
  this.agencies = [{id: 0, name: "All", acronym: "All"}];

  bi.ajax(nav(null, true)).then(function (r){

    if(m.route() == routes.controllers.Requests.index().url){

      function goToTab(tab){
        var dest = nav({tab: tab});
        if(m.route() != dest){
          m.route(dest);
        }
      }

      if(this.app.isSuperAdmin()){
        goToTab("assessor");
      } else if(_.contains(this.app.currentUser().permissions, process.permissions.SIGNOFF)){
        goToTab("signoff");
      } else {
        goToTab("all");
      }

    }

    this.requestList = r.list;
    this.counts = r.counts;
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