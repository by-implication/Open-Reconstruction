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
  this.counts = {};

  var targetUrl = routes.controllers.Requests.indexPage(this.tab, this.page, this.projectTypeId).url;
  if(m.route() != targetUrl){
    m.route(targetUrl);
  }

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

  bi.ajax(routes.controllers.Requests.indexMeta(this.tab, this.page, this.projectTypeId)).then(function (r){

    if(m.route() == routes.controllers.Requests.index().url){

      function goTo(route){
        var dest = route.url;
        if(m.route() != dest){
          m.route(dest);
        }
      }

      if(this.app.isSuperAdmin()){
        goTo(routes.controllers.Requests.indexPage("assessor", this.page, this.projectTypeId));
      } else if(_.contains(this.app.currentUser().permissions, 5)){
        goTo(routes.controllers.Requests.indexPage("signoff", this.page, this.projectTypeId));
      } else if(_.contains(this.app.currentUser().permissions, 1)){
        goTo(routes.controllers.Requests.indexPage("mine", this.page, this.projectTypeId));
      } else {
        goTo(routes.controllers.Requests.indexPage("all", this.page, this.projectTypeId));
      }

    }

    this.requestList = r.list;
    this.counts = r.counts;
    this.projectFilters = this.projectFilters.concat(r.filters);

  }.bind(this));

}