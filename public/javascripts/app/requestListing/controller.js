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
  this.sortBy = m.prop("id");

  this.tab = m.route.param("tab") || "all";
  this.page = parseInt(m.route.param("page")) || 0;
  this.projectTypeId = m.route.param("projectTypeId") || 0;
  this._queryLocFilters = m.route.param("locFilters");
  this.queryLocFilters = (this._queryLocFilters || "").split(".");
  this.counts = {};

  function DefLocFilter(label, value){
    this.label = label;
    this.data = [];
    this.value = m.prop(value);
    this.onchange = function(v){
      this.value(v);
      var index = self.locFilters.indexOf(this);
      var locFilterQueryParam = self.locFilters.filter(function (e){
        return i <= index;
      }).map(function (f, i){
        return f.value();
      }).join(".");
      var targetRoute = routes.controllers.Requests.indexPage(
        self.tab, self.page, self.projectTypeId, locFilterQueryParam
      ).url;
      m.route(targetRoute);
    }
  };

  this.locFilters = ["Region", "Province", "City / Municipality", "Barangay"].map(function (label, index){
    return new DefLocFilter(label, self.queryLocFilters[index]);
  });

  var tabs = [
    {
      identifier: this.tabFilters.ALL,
      href: routes.controllers.Requests.indexPage("all", this.page, this.projectTypeId).url,
      _label: "All"
    },
    {
      identifier: this.tabFilters.SIGNOFF,
      href: routes.controllers.Requests.indexPage("signoff", this.page, this.projectTypeId).url,
      when: function(){ return _.contains(self.app.currentUser().permissions, 5) },
      _label: "Needs signoff"
    },
    {
      identifier: this.tabFilters.ASSESSOR,
      href: routes.controllers.Requests.indexPage("assessor", this.page, this.projectTypeId).url,
      when: function(){ return self.app.isSuperAdmin() },
      _label: "Needs assessor"
    },
    {
      identifier: this.tabFilters.MINE,
      href: routes.controllers.Requests.indexPage("mine", this.page, this.projectTypeId).url,
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
      href: routes.controllers.Requests.indexPage("approval", this.page, this.projectTypeId).url,
      when: function(){ return !self.app.currentUser() },
      _label: "Pending Approval"
    },
    {
      identifier: this.tabFilters.IMPLEMENTATION,
      href: routes.controllers.Requests.indexPage("implementation", this.page, this.projectTypeId).url,
      when: function(){ return !self.app.currentUser() },
      _label: "Implementation"
    },
  ].map(function (tab){
    tab.requests = function(){
      return self.requestList
        .filter(function (r){ return tab.filter ? !r.isRejected : true })
        .filter(tab.filter || function(){ return true })
        .sort(function (a, b){
          return b[self.sortBy()] - a[self.sortBy()]
        })
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
    return Math.floor(count / 20);
  };

  bi.ajax(routes.controllers.Requests.indexMeta(this.tab, this.page, this.projectTypeId, this._queryLocFilters)).then(function (r){

    if(m.route() == routes.controllers.Requests.index().url){

      function goTo(route){
        var dest = route.url;
        if(m.route() != dest){
          m.route(dest);
        }
      }

      if(this.app.isSuperAdmin()){
        goTo(routes.controllers.Requests.indexPage("assessor", this.page, this.projectTypeId, this._queryLocFilters));
      } else if(_.contains(this.app.currentUser().permissions, 5)){
        goTo(routes.controllers.Requests.indexPage("signoff", this.page, this.projectTypeId, this._queryLocFilters));
      } else if(_.contains(this.app.currentUser().permissions, 1)){
        goTo(routes.controllers.Requests.indexPage("mine", this.page, this.projectTypeId, this._queryLocFilters));
      } else {
        goTo(routes.controllers.Requests.indexPage("all", this.page, this.projectTypeId, this._queryLocFilters));
      }

    }

    this.requestList = r.list;
    this.counts = r.counts;
    this.projectFilters = this.projectFilters.concat(r.filters);
    for(var i in r.locFilters){
      this.locFilters[i].data = [{id: 0, name: 'All'}].concat(r.locFilters[i].sort(function (a, b){
        return a.id - b.id;
      }));
    }

  }.bind(this));

}