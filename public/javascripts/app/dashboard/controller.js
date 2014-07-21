dashboard.controller = function(){

  var ctrl = this;
  this.app = new app.controller();

  this.tab = m.route.param("t") || "pending";
  this.page = parseInt(m.route.param("p")) || 1;

  this.tabs = new common.tabs.controller();
  this.counts = {};

  this.tabFilters = {
    FEED: 'feed',
    PENDING: 'pending',
    MINE: 'mine'
  }

  var nav = function(params){
    return routes.controllers.Dashboard.tab(params.tab).url
  }

  var tabs = [
    {
      identifier: this.tabFilters.FEED,
      href: nav({tab: "feed"}),
      label: m.prop("Feed")
    },
    {
      identifier: this.tabFilters.PENDING,
      href: nav({tab: "pending"}),
      label: m.prop("Pending requests")
    },
    {
      identifier: this.tabFilters.MINE,
      href: nav({tab: "mine"}),
      label: m.prop("My requests")
    }
  ];

  this.tabs.tabs = m.prop(tabs);
  this.count = m.prop(0);
  this.pageLimit = m.prop(1);

  switch(this.tab){

    case "feed": {
      this.events = m.prop([]);
      this.lastVisit = m.prop();
      break;
    }

    default: this.reqs = m.prop([]);

  }

  bi.ajax(routes.controllers.Dashboard.tabMeta(this.tab, this.page)).then(function (r){

    ctrl.count(r.count);
    ctrl.pageLimit(r.pageLimit);

    switch(ctrl.tab){
      case "feed": {
        ctrl.events(r.events);
        ctrl.lastVisit(r.lastVisit);
        break;
      }
      default: {
        ctrl.reqs(r.reqs);
      }
    }

  });
  
}
