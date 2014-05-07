requestListing.controller = function(){
  var self = this;
  this.app = new app.controller();
  this.tabs = new common.tabs.controller();
  this.tabFilters = {
    ALL: 'ALL',
    SIGNOFF: 'SIGNOFF',
    ASSESSOR: 'ASSESSOR',
    MINE: 'MINE',
    APPROVAL: 'APPROVAL',
    IMPLEMENTATION: 'IMPLEMENTATION'
  }
  this.sortBy = m.prop("id");

  var requestFilter = function (r){
    if(!self.currentFilter.requests()){
      return true;
    } else {
      return r.projectType == self.currentFilter.requests();
    }
  }

  var tabs = [
    {
      identifier: this.tabFilters.ALL,
      href: routes.controllers.Requests.indexAll().url,
      _label: "All"
    },
    {
      identifier: this.tabFilters.SIGNOFF,
      href: routes.controllers.Requests.indexSignoff().url,
      when: function(){ return self.app.currentUser() && _.contains(self.app.currentUser().permissions, 5) },
      filter: function (r){ return r.canSignoff },
      _label: "Needs signoff"
    },
    {
      identifier: this.tabFilters.ASSESSOR,
      href: routes.controllers.Requests.indexAssessor().url,
      when: function(){ return self.app.isSuperAdmin() },
      filter: function (r){ return r.level === 0 && !r.assessingAgencyId },
      _label: "Needs assessor"
    },
    {
      identifier: this.tabFilters.MINE,
      href: routes.controllers.Requests.indexMine().url,
      when: function(){ return self.app.currentUser() && _.contains(self.app.currentUser().permissions, 1) },
      filter: function (r){ return r.author.govUnitId === self.app.currentUser().govUnit.id },
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
      href: routes.controllers.Requests.indexApproval().url,
      when: function(){ return !self.app.currentUser() },
      filter: function (r){ return r.level <= 4 },
      _label: "Pending Approval"
    },
    {
      identifier: this.tabFilters.IMPLEMENTATION,
      href: routes.controllers.Requests.indexImplementation().url,
      when: function(){ return !self.app.currentUser() },
      filter: function (r){ return r.level > 4 },
      _label: "Implementation"
    },
  ].map(function (tab){
    tab.requests = function(){
      return self.requestList
        .filter(tab.filter || function(){ return true })
        .filter(requestFilter)
        .sort(function (a, b){
          return b[self.sortBy()] - a[self.sortBy()]
        })
    }
    tab.label = function(){
      return [
        typeof tab._label == 'function' ? tab._label() : tab._label,
        m("span.label.secondary.round", tab.requests().length)
      ]
    }
    tab.content = function(){ return request.listView(this.requests(), self.sortBy) }
    return tab;
  });

  this.tabs.tabs = m.prop(tabs);
  this.requestList = m.prop([]);
  this.projectFilters = m.prop([]);
  this.currentFilter = {
    requests: m.prop("")
  };

  // not sure if should
  this.app.whenUserInfoLoads = function(){
    // can't use config for when tabs loads because user data is asynchronous.

    // can't use this anymore because currentTab isn't m.prop anymore.
    // perhaps should use m.route?
    // if(this.app.isSuperAdmin()){
    //   this.tabs.currentTab("Needs assessor");
    // } else if(this.app.currentUser() && _.contains(this.app.currentUser().permissions, 5)){
    //   this.tabs.currentTab("Needs signoff");
    // } else if(this.app.currentUser() && _.contains(this.app.currentUser().permissions, 1)){
    //   this.tabs.currentTab("My requests");
    // } else {
    //   this.tabs.currentTab("All");
    // }
  }.bind(this)

  this.setSort = function(sort){
    
  }

  bi.ajax(routes.controllers.Requests.indexMeta()).then(function (r){
    self.requestList = r.list;
    self.projectFilters = r.filters;
  });

}