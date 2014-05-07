requestListing.controller = function(){
  var self = this;
  this.app = new app.controller();
  this.tabs = new common.tabs.controller();
  this.currentSort = m.prop();
  var badges = {
    all: m.prop(),
    signoff: m.prop(),
    assessor: m.prop(),
    mine: m.prop(),
    approval: m.prop(),
    implementation: m.prop()
  }
  this.tabFilters = {
    ALL: 'ALL',
    SIGNOFF: 'SIGNOFF',
    ASSESSOR: 'ASSESSOR',
    MINE: 'MINE',
    APPROVAL: 'APPROVAL',
    IMPLEMENTATION: 'IMPLEMENTATION'
  }

  function myAgency(){
    if(self.app.currentUser().govUnit && self.app.currentUser().govUnit.role == "LGU") {
      return "My LGU's requests";
    } else {
      return "My agency's requests";
    }
  }

  this.tabs.tabs = m.prop([
    {
      label: m.prop("All"), 
      href: routes.controllers.Requests.indexAll().url, 
      badge: badges.all, 
      identifier: this.tabFilters.ALL
    },
    {
      label: m.prop("Needs signoff"), 
      when: function(){
        return self.app.currentUser() && _.contains(self.app.currentUser().permissions, 5);
      }, 
      href: routes.controllers.Requests.indexSignoff().url, 
      badge: badges.signoff, 
      identifier: this.tabFilters.SIGNOFF
    },
    {
      label: m.prop("Needs assessor"), 
      when: function(){
        return self.app.isSuperAdmin();
      }, 
      href: routes.controllers.Requests.indexAssessor().url, 
      badge: badges.assessor, 
      identifier: this.tabFilters.ASSESSOR
    },
    {
      label: myAgency, 
      when: function(){
        return self.app.currentUser() && _.contains(self.app.currentUser().permissions, 1);
      }, 
      href: routes.controllers.Requests.indexMine().url, 
      badge: badges.mine, 
      identifier: this.tabFilters.MINE
    },
    {
      label: m.prop("Pending Approval"), 
      when: function(){
        return !self.app.currentUser();
      }, 
      href: routes.controllers.Requests.indexApproval().url, 
      badge: badges.approval, 
      identifier: this.tabFilters.APPROVAL
    },
    {
      label: m.prop("Implementation"), 
      when: function(){
        return !self.app.currentUser();
      }, 
      href: routes.controllers.Requests.indexImplementation().url, 
      badge: badges.implementation, 
      identifier: this.tabFilters.IMPLEMENTATION
    },
  ]);
  
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
    badges.all(r.counts.all);
    badges.signoff(r.counts.signoff);
    badges.assessor(r.counts.assessor);
    badges.mine(r.counts.mine);
    // replace this with real shit
    badges.approval(1);
    badges.implementation(1);
  
    self.filteredList = function(){
      return _.chain(self.requestList)
        .filter(function(p){
          if(!self.currentFilter.requests()){
            return true;
          } else {
            return p.projectType == self.currentFilter.requests();
          }
        })
        .filter(function(p){
          if(!p.isRejected){          
            switch(self.tabs.currentTab()){
              case self.tabFilters.SIGNOFF:
                return p.canSignoff;
                break;
              case self.tabFilters.ASSESSOR:
                return p.level === 0 && !p.assessingAgencyId;
                break;
              case self.tabFilters.MINE:
                return p.author.govUnitId === self.app.currentUser().govUnit.id;
                break;
              case self.tabFilters.APPROVAL:
                return p.level <= 4
                break;
              case self.tabFilters.IMPLEMENTATION:
                return p.level > 4
                break;
              default:
                return true;
            }
          } else {
            return false
          }
        })
        .sortBy(function(p){
          if(typeof self.currentSort() === "undefined"){
            self.currentSort("age");
          }
          return -1 * p[self.currentSort()];
        })
    }
  });

}