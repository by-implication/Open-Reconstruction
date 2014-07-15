projectIndex.controller = function(){
  
  var ctrl = this;
  this.app = new app.controller();
  this.page = parseInt(m.route.param("p")) || 1;
  this.projects = m.prop([]);
  this.count = m.prop(0);
  this.pageLimit = m.prop(1);

  bi.ajax(routes.controllers.Projects.indexMeta(this.page)).then(function (r){
    ctrl.projects(r.projects);
    ctrl.count(r.count);
    ctrl.pageLimit(r.pageLimit);
  });

}