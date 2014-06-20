requestListing.controller = function(){
  var self = this;
  this.app = new app.controller();
  this.tabs = new common.tabs.controller();
  this.tabFilters = {
    ALL: 'all',
    SIGNOFF: 'signoff',
    ASSESSOR: 'assessor',
    MINE: 'mine',
    APPROVAL: 'approval',
    IMPLEMENTATION: 'implementation'
  }
  this.disasters = [];

  this.tab = m.route.param("tab") || "all";
  this.page = parseInt(m.route.param("page")) || 1;
  this.projectTypeId = m.route.param("projectTypeId") || 0;
  this._queryLocFilters = m.route.param("l") || "-";
  this.sort = m.route.param("sort") || "id";
  this.sortDir = m.route.param("sortDir") || "asc";
  this.disaster = m.route.param("disaster") || 0;

  var nav = this.nav = function(params, meta){
    var keys = ["tab", "page", "projectTypeId", "_queryLocFilters", "sort", "sortDir", "disaster"];
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

  function DefLocFilter(label, value){
    this.label = label;
    this.data = [];
    this.value = m.prop(value);
    this.onchange = function(v){
      this.value(v);
      var targetRoute = nav({_queryLocFilters: v});
      m.route(targetRoute);
    }
  };

  this.locFilters = ["Region", "Province", "City / Municipality", "Barangay"].map(function (label, index){
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
      when: function(){ return _.contains(self.app.currentUser().permissions, 5) },
      _label: "Needs signoff"
    },
    {
      identifier: this.tabFilters.ASSESSOR,
      href: nav({tab: "assessor"}),
      when: function(){ return self.app.isSuperAdmin() },
      _label: "Needs assessor"
    },
    {
      identifier: this.tabFilters.MINE,
      href: nav({tab: "mine"}),
      when: function(){ return _.contains(self.app.currentUser().permissions, 1) },
      _label: function(){
        if(self.app.currentUser().govUnit && self.app.currentUser().govUnit.role == "LGU") {
          return "My LGU's requests";
        } else {
          return "My agency's requests";
        }
      }
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
  this.maxPage = function(){
    var count = parseInt(this.counts[this.tab]) || 0;
    return Math.ceil(count / 20);
  };

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
      } else if(_.contains(this.app.currentUser().permissions, 5)){
        goToTab("signoff");
      } else if(_.contains(this.app.currentUser().permissions, 1)){
        goToTab("mine");
      } else {
        goToTab("all");
      }

    }

    this.requestList = r.list;
    this.counts = r.counts;
    this.projectFilters = this.projectFilters.concat(r.filters);
    this.disasters = ["All"].concat(r.disasters);
    for(var i in r.locFilters){
      this.locFilters[i].data = [{id: '-', name: 'All'}].concat(r.locFilters[i].sort(function (a, b){
        return a.id - b.id;
      }));
    }

  }.bind(this));

}