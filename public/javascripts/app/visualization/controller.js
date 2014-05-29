visualization.controller = function(){
  var self = this;

  this.app = new app.controller();

  this.mostCommonDisasterType = m.prop(0);
  this.mostCommonProjectType = m.prop(0);
  this.byDisasterType = m.prop([]);
  this.byMonth = m.prop([]);
  this.byLevel = m.prop([]);

  this.id = m.route.param('v');

  m.startComputation();
  bi.ajax(routes.controllers.Application.dashboardMeta()).then(function (r){
    self.mostCommonDisasterType(r.mostCommonDisasterType);
    self.mostCommonProjectType(r.mostCommonProjectType);
    self.byLevel(r.byLevel);
    self.byMonth(visualizations.padMonths(r.byMonth));
    self.byDisasterType(r.byDisasterType);
    m.endComputation();
  });

  this.vis = _.extend({}, visualizations.library[this.id](self));
  this.vis.size().width = undefined;
  this.vis.size().height = 300;
  this.vis.fullView(true);
}