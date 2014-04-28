projectListing.controller = function(){
  var self = this;
  this.app = new app.controller();
  this.tabs = new common.tabs.controller("/projects");
  var badges = {
    all: m.prop(),
    signoff: m.prop(),
    assessor: m.prop(),
    mine: m.prop()
  }

  this.tabFilters = {
    ALL: 'ALL',
    SIGNOFF: 'SIGNOFF',
    ASSESSOR: 'ASSESSOR',
    MINE: 'MINE'
  }

  function myAgency(){
    return self.app.currentUser().agency ? (self.app.currentUser().agency.name + "'s requests") : "My requests";
  }

  this.tabs.tabs = m.prop([
    {label: m.prop("All"), href: "all", badge: badges.all, identifier: this.tabFilters.ALL},
    {label: m.prop("For signoff"), when: function(){
      return self.app.currentUser() && _.contains(self.app.currentUser().permissions, 5);
    }, href: "signoff", badge: badges.signoff, identifier: this.tabFilters.SIGNOFF},
    {label: m.prop("For assigning assessor"), when: function(){
      return self.app.isSuperAdmin();
    }, href: "assessor", badge: badges.assessor, identifier: this.tabFilters.ASSESSOR},
    {label: myAgency, when: function(){
      return self.app.currentUser() && _.contains(self.app.currentUser().permissions, 1);
    }, href: "mine", badge: badges.mine, identifier: this.tabFilters.MINE}
  ]);
  
  this.projectList = m.prop([]);
  this.projectFilters = m.prop([]);
  this.currentFilter = {
    projects: m.prop("")
  };

  // not sure if should
  this.app.whenUserInfoLoads = function(){
    // can't use config for when tabs loads because user data is asynchronous.

    if(this.app.isSuperAdmin()){
      this.tabs.currentTab("For assigning assessor");
    } else if(this.app.currentUser() && _.contains(this.app.currentUser().permissions, 5)){
      this.tabs.currentTab("For signoff");
    } else if(this.app.currentUser() && _.contains(this.app.currentUser().permissions, 1)){
      this.tabs.currentTab("My requests");
    } else {
      this.tabs.currentTab("All");
    }
  }.bind(this)

  m.request({method: "GET", url: "/requests"}).then(function (r){
    self.projectList = r.list;
    self.projectFilters = r.filters;
    badges.all(r.counts.all);
    badges.signoff(r.counts.signoff);
    badges.assessor(r.counts.assessor);
    badges.mine(r.counts.mine);
  });

}