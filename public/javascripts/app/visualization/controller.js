visualization.controller = function(){
  var self = this;
  this.app = new app.controller();

  var id = m.route.param('v');
  bi.ajax(routes.controllers.Visualizations.viewMeta(id)).then(function (r){
    self.data = r.data;
  });
}