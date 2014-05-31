visualization.controller = function(){
  var self = this;

  this.app = new app.controller();

  this.requests = m.prop({});
  this.projects = m.prop({});
  this.saros = m.prop({});

  this.mostCommonDisasterType = m.prop(0);
  this.mostCommonProjectType = m.prop(0);

  this.requests().byDisasterType = m.prop([]);
  this.requests().byProjectType = m.prop([]);
  this.requests().byMonth = m.prop([]);
  this.requests().byLevel = m.prop([]);
  this.requests().byNamedDisaster = m.prop();

  this.id = m.route.param('v');

  m.startComputation();
  bi.ajax(routes.controllers.Application.dashboardMeta()).then(function (r){
    self.mostCommonDisasterType(r.mostCommonDisasterType);
    self.mostCommonProjectType(r.mostCommonProjectType);

    self.requests().byLevel(r.byLevel);
    self.requests().byMonth(visualizations.padMonths(r.byMonth));
    self.requests().byDisasterType(r.byDisasterType);
    self.requests().byProjectType(r.byProjectType);
    self.requests().byNamedDisaster(r.byNamedDisaster);
    m.endComputation();
  });

  bi.ajax(routes.controllers.Visualizations.getData("EPLC")).then(function (r){
    console.log(r.data);
  });

  bi.ajax(routes.controllers.Visualizations.getData("DBMBureauG")).then(function(r){
    self.saros(r.data);
  })

  this.vis = _.extend({}, visualizations.library[this.id](self));
  this.vis.size().width = undefined;
  this.vis.size().height = 300;
  this.vis.isFullView(true);
}