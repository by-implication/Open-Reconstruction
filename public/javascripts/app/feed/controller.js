feed.controller = function(){

  var ctrl = this;
  this.app = new app.controller();
  this.events = m.prop([]);
  this.lastVisit = m.prop();
  this.page = parseInt(m.route.param("p")) || 1;
  this.count = m.prop(0);
  this.pageLimit = m.prop(1);

  bi.ajax(routes.controllers.Feed.indexMeta(this.page)).then(function (r){
  	ctrl.events(r.events);
  	ctrl.lastVisit(r.lastVisit);
  	ctrl.count(r.count);
  	ctrl.pageLimit(r.pageLimit);
  });
  
}
