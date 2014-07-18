dashboard.controller = function(){

  var ctrl = this;
  this.app = new app.controller();
  this.tabs = new common.tabs.controller();

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
  
  this.tab = m.route.param("tab") || "all";

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
    tab.content = function(){ return request.listView(this.requests(), self.sortBy, self) }
    return tab;
  });

  this.tabs.tabs = m.prop(tabs);
  
}
