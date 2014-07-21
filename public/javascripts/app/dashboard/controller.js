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
    return routes.controllers.Dashboard[params.tab]().url
  }

  this.tabs.tabs = function(){
    return [{
      identifier: ctrl.tabFilters.FEED,
      href: nav({tab: "feed"}),
      label: m.prop("Feed")
    }].concat(ctrl.app.isSuperAdmin() ? {
      identifier: ctrl.tabFilters.PENDING,
      href: nav({tab: "pending"}),
      label: m.prop("Pending requests")
    } : []).concat({
      identifier: ctrl.tabFilters.MINE,
      href: nav({tab: "mine"}),
      label: m.prop("My requests")
    });
  };
  this.count = m.prop(0);
  this.pageLimit = m.prop(1);

  switch(this.tab){

    case "feed": {

      this.events = m.prop([]);
      this.lastVisit = m.prop();

      bi.ajax(routes.controllers.Dashboard.feedMeta(this.page)).then(function (r){
        ctrl.count(r.count);
        ctrl.pageLimit(r.pageLimit);
        ctrl.events(r.events);
        ctrl.lastVisit(r.lastVisit);
      });

      break;

    }

    case "mine": {

      this.reqs = m.prop([]);

      bi.ajax(routes.controllers.Dashboard.mineMeta(this.page)).then(function (r){

        ctrl.count(r.count);
        ctrl.pageLimit(r.pageLimit);
        ctrl.reqs(r.reqs);

      });

      break;

    }

    case "pending": {


      this.filter = m.route.param("f") || "signoff";
      this.reqs = m.prop([]);

      bi.ajax(routes.controllers.Dashboard.pendingMeta(this.filter, this.page)).then(function (r){
        ctrl.count(r.count);
        ctrl.pageLimit(r.pageLimit);
        ctrl.reqs(r.reqs);
      });

      break;

    }

  }
  
}
