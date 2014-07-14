feed.controller = function(){

  var ctrl = this;
  this.app = new app.controller();
  this.events = m.prop([]);
  this.lastVisit = m.prop();

  bi.ajax(routes.controllers.Feed.indexMeta()).then(function (r){
  	ctrl.events(r.events);
  	ctrl.lastVisit(r.lastVisit);
  });
  
}
